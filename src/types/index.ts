export type TemperamentType = 'Melancholy' | 'Choleric' | 'Sanguine' | 'Phlegmatic';

export interface QuestionOption {
  label: string;
  value: TemperamentType;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface TemperamentProfile {
  type: TemperamentType;
  strengths: string[];
  growthAreas: string[];
  description: string; // The "atomic" text for blending
}

export interface TestResult {
  primary: TemperamentType;
  secondary: TemperamentType;
  scores: Record<TemperamentType, number>;
  isBlend: boolean; // True if primary and secondary scores are equal
  timestamp: Date;
  analysis?: string;
}

export interface AssessmentRecord {
  id: string;
  userName: string;
  userEmail: string;
  primary: TemperamentType;
  secondary: TemperamentType;
  isBlend: boolean;
  date: any; // Firestore Timestamp
  scores: Record<TemperamentType, number>;
  analysis?: string;
}