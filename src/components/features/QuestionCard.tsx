import { motion } from 'framer-motion';
import type { Question, QuestionOption } from '../../types';
import { cn } from '../../lib/utils';

interface QuestionCardProps {
  question: Question;
  onSelect: (option: QuestionOption) => void;
  selectedOption?: QuestionOption;
}

export const QuestionCard = ({ question, onSelect, selectedOption }: QuestionCardProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel p-6 md:p-10 rounded-2xl relative overflow-hidden"
      >
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 leading-tight relative z-10">
          {question.text}
        </h3>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {question.options.map((option, index) => {
            const isSelected = selectedOption?.value === option.value;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(option)}
                className={cn(
                  "text-left p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                  isSelected
                    ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/25"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className={cn(
                    "text-lg font-medium transition-colors",
                    isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                  )}>
                    {option.label}
                  </span>

                  {/* Radio Circle Indicator */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "border-white bg-white/20"
                      : "border-slate-600 group-hover:border-indigo-400"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};