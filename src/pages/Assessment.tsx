import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '../store/assessmentStore';
import { UserInfoForm } from '../components/features/UserInfoForm';
import { QuestionCard } from '../components/features/QuestionCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TEST_QUESTIONS } from '../lib/data';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Assessment = () => {
  const {
    userInfo,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    isFinished,
    finishAssessment
  } = useAssessmentStore();

  const currentQuestion = TEST_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === TEST_QUESTIONS.length - 1;
  const hasAnsweredCurrent = !!answers[currentQuestion?.id];

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  // If we don't know who the user is, ask them first
  if (!userInfo) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
        <UserInfoForm />
      </div>
    );
  }

  // If the test is finished, show a placeholder (for now)
  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-3xl font-serif">Assessment Complete. Generating Report...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
      {/* Header / Progress */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex justify-between items-end text-sm font-medium text-slate-400">
          <span>Question {currentQuestionIndex + 1} of {TEST_QUESTIONS.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / TEST_QUESTIONS.length) * 100)}% Completed</span>
        </div>
        <ProgressBar current={currentQuestionIndex + 1} total={TEST_QUESTIONS.length} />
      </div>

      {/* The Question Area */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onSelect={(option) => setAnswer(currentQuestion.id, option)}
          selectedOption={answers[currentQuestion.id]}
        />
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex justify-between mt-10 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={currentQuestionIndex === 0 ? 'invisible' : ''}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          disabled={!hasAnsweredCurrent}
          onClick={() => {
            if (isLastQuestion) {
              finishAssessment();
            } else {
              nextQuestion();
            }
          }}
        >
          {isLastQuestion ? 'Finish Assessment' : 'Next Question'}
          {!isLastQuestion && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};