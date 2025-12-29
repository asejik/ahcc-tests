export type TemperamentType = 'Choleric' | 'Sanguine' | 'Phlegmatic' | 'Melancholy';

// --- ADDED THESE MISSING TYPES ---
export interface QuestionOption {
  label: string;
  value: string; // or TemperamentType
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface TemperamentProfile {
  type: TemperamentType;
  description: string;
  strengths: string[];
  growthAreas: string[];
}
// ---------------------------------

export interface TestResult {
  primary: string | TemperamentType;
  secondary: string | TemperamentType;
  scores: Record<string, number>;
  isBlend: boolean;
  analysis?: string;
  type?: string;
  levels?: Record<string, string>;

  // Timestamps
  timestamp?: any;
  date?: any;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface AssessmentRecord extends TestResult {
  id: string;
  userName: string;
  userEmail: string;
  date: any;
}