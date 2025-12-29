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
  description: string;
}

// 1. We make TestResult flexible enough for both tests
export interface TestResult {
  primary: TemperamentType | string; // Allows "Big Five Profile"
  secondary: TemperamentType | string;
  scores: Record<string, number>;    // Allows "Openness" (string) keys, not just TemperamentType
  isBlend: boolean;
  analysis?: string;
  type?: string;                     // "Temperament" or "Big Five"
  levels?: Record<string, string>;   // "High", "Low" etc.
}

// 2. AssessmentRecord now INHERITS everything above (type, analysis, levels, etc.)
export interface AssessmentRecord extends TestResult {
  id: string;
  userName: string;
  userEmail: string;
  date: any; // Firestore Timestamp
}