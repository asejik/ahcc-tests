export type TemperamentType = 'Choleric' | 'Sanguine' | 'Phlegmatic' | 'Melancholy';

export interface TestResult {
  primary: string | TemperamentType;
  secondary: string | TemperamentType;
  scores: Record<string, number>;
  isBlend: boolean;
  analysis?: string;
  type?: string;     // e.g., "Love Languages", "Big Five"
  levels?: Record<string, string>; // Specific to Big Five (Low/High)

  // These caused the error before, so we add them here:
  timestamp?: any;
  date?: any;
}

export interface UserInfo {
  name: string;
  email: string;
}

// What we save to Firebase (extends the result above)
export interface AssessmentRecord extends TestResult {
  id: string;
  userName: string;
  userEmail: string;
  date: any; // Firestore Timestamp
}