import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface AccessCode {
  id?: string;
  code: string;
  testType: string;
  usesLeft: number; // -1 means Infinite
  createdAt: any;
  note?: string;
}

const generateRandomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Updated: Accepts uses (default 2, pass -1 for infinite)
export const createAccessCode = async (testType: string, note: string = '', uses: number = 2) => {
  const code = generateRandomCode();
  await addDoc(collection(db, 'access_codes'), {
    code,
    testType,
    usesLeft: uses,
    createdAt: serverTimestamp(),
    note
  });
  return code;
};

export const verifyAndUseCode = async (inputCode: string, requiredTestType: string): Promise<{ valid: boolean; message: string }> => {
  const normalizedCode = inputCode.toUpperCase().trim();

  const q = query(
    collection(db, 'access_codes'),
    where('code', '==', normalizedCode)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { valid: false, message: "Invalid access code." };
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  // 'All' allows the code to work for ANY assessment
  if (data.testType !== 'All' && data.testType !== requiredTestType) {
    return { valid: false, message: `This code is for ${data.testType}, not ${requiredTestType}.` };
  }

  // Check usage limit (Ignore if -1)
  if (data.usesLeft !== -1 && data.usesLeft <= 0) {
    return { valid: false, message: "This code has been fully used." };
  }

  // Only decrement if NOT infinite (-1)
  if (data.usesLeft !== -1) {
    await updateDoc(doc(db, 'access_codes', docSnap.id), {
        usesLeft: increment(-1)
    });
  }

  return { valid: true, message: "Success" };
};