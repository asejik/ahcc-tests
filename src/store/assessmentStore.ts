import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuestionOption } from '../types';

interface UserInfo {
  name: string;
  email: string;
}

interface AssessmentState {
  // State
  userInfo: UserInfo | null;
  currentQuestionIndex: number;
  answers: Record<number, QuestionOption>; // Map question ID to selected option
  isFinished: boolean;

  // Actions
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: number, option: QuestionOption) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetAssessment: () => void;
  finishAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      userInfo: null,
      currentQuestionIndex: 0,
      answers: {},
      isFinished: false,

      setUserInfo: (info) => set({ userInfo: info }),

      setAnswer: (questionId, option) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: option },
        })),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),

      finishAssessment: () => set({ isFinished: true }),

      resetAssessment: () =>
        set({
          userInfo: null,
          currentQuestionIndex: 0,
          answers: {},
          isFinished: false,
        }),
    }),
    {
      name: 'anchor-assessment-storage',
    }
  )
);