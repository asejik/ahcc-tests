import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import emailjs from '@emailjs/browser';
import type { TestResult } from "../types";

interface UserData {
  name: string;
  email: string;
}

export const saveAssessment = async (userInfo: UserData, result: TestResult) => {
  try {
    // 1. Save to Firebase
    const docRef = await addDoc(collection(db, "assessments"), {
      userName: userInfo.name,
      userEmail: userInfo.email,
      primary: result.primary,
      secondary: result.secondary,
      scores: result.scores,
      isBlend: result.isBlend,
      analysis: result.analysis || "No analysis generated",
      date: new Date(),
      type: "Temperament Test"
    });

    console.log("✅ Document saved with ID: ", docRef.id);

    // 2. Send Email via EmailJS
    console.log("📧 Attempting to send email...");
    console.log("DEBUG: Checking Keys...");
    console.log("Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log("Template ID:", import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
    console.log("Public Key:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        user_name: userInfo.name,
        user_email: userInfo.email,
        primary: result.primary,
        secondary: result.secondary,
        blend_status: result.isBlend ? "Co-Dominant" : "Standard",
        ai_summary: result.analysis?.substring(0, 500) + "...", // Truncate if too long for email
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Email sent successfully!");
    return true;

  } catch (e) {
    console.error("❌ Error during save/email process: ", e);
    return false;
  }
};