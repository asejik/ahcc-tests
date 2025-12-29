import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = Math.min(100, (current / total) * 100);

  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};