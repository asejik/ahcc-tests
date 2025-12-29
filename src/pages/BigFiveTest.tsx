import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BIG_FIVE_QUESTIONS, BIG_FIVE_INTERPRETATIONS } from '../lib/bigFiveData';
import { calculateBigFiveScores, generateBigFivePrompt } from '../lib/bigFiveLogic';
import { getGenericAnalysis } from '../lib/gemini';
import { saveAssessment } from '../lib/services';
import { useAssessmentStore } from '../store/assessmentStore';
import { Button } from '../components/ui/Button';
import { ArrowRight, ArrowLeft, Download, RefreshCcw } from 'lucide-react';

export const BigFiveTest = () => {
  const navigate = useNavigate();
  const { userInfo } = useAssessmentStore();

  // States
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Store the full result here to display it
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    if (!userInfo) navigate('/');
  }, [userInfo, navigate]);

  if (!userInfo) return null;

  const currentQ = BIG_FIVE_QUESTIONS[currentIdx];
  const totalQ = BIG_FIVE_QUESTIONS.length;
  const progress = ((currentIdx + 1) / totalQ) * 100;

  const handleSelect = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentIdx < totalQ - 1) {
      setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
    }
  };

  const handleNext = () => { if (currentIdx < totalQ - 1) setCurrentIdx(prev => prev + 1); };
  const handleBack = () => { if (currentIdx > 0) setCurrentIdx(prev => prev - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const calculated = calculateBigFiveScores(answers);
      const aiPrompt = generateBigFivePrompt(userInfo.name, calculated);
      const aiAnalysis = await getGenericAnalysis(aiPrompt);

      // Create the full object
      const fullResult = {
        primary: "Big Five Profile",
        secondary: "N/A",
        scores: calculated.scores,
        levels: calculated.levels,
        isBlend: false,
        analysis: aiAnalysis,
        type: "Big Five"
      };

      // Save to Firebase
      await saveAssessment(userInfo, fullResult as any);

      // Save to State (So we can show it!)
      setResultData(fullResult);

    } catch (error) {
      console.error(error);
      alert("Error saving results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RESULT VIEW (RENDERED AFTER SUCCESS) ---
  if (resultData) {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-emerald-400 font-medium mb-2 uppercase tracking-widest text-sm">Assessment Complete</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Big Five Profile</h1>

          {/* AI Analysis Box */}
          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 text-left">
            <div className="text-lg text-slate-300 leading-relaxed space-y-4">
               {resultData.analysis.split('\n').map((p: string, i: number) =>
                 p.trim() && <p key={i}>{p}</p>
               )}
            </div>
          </div>
        </motion.div>

        {/* 5 Trait Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Object.entries(resultData.scores).map(([trait, score]) => {
            const level = resultData.levels[trait]; // Low, Moderate, High
            // @ts-ignore
            const description = BIG_FIVE_INTERPRETATIONS[trait][level];
            const maxScore = 20; // Based on 4 questions * 5 points

            return (
              <div key={trait} className="glass-panel p-6 rounded-xl border-l-4 border-indigo-500">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-white">{trait}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                    ${level === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                      level === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'}`}>
                    {level}
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full mb-4">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(Number(score) / maxScore) * 100}%` }}
                  />
                </div>

                <p className="text-slate-400 text-sm mb-2">{description}</p>
                <p className="text-xs text-slate-500 text-right">Score: {Number(score)} / 20</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" /> Save PDF
          </Button>
          <Button onClick={() => navigate('/')}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </div>
      </div>
    );
  }

  // --- QUESTION VIEW (NORMAL) ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-3xl mx-auto pt-20">
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Question {currentIdx + 1} of {totalQ}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-panel w-full p-8 md:p-12 rounded-3xl relative min-h-[450px] flex flex-col justify-between border-t border-white/10">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            <div className="mb-6 flex justify-center">
               <span className="text-[10px] uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                 {currentQ.trait}
               </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-white text-center mb-10 leading-relaxed">
              {currentQ.text}
            </h2>

            <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(val)}
                  className={`
                    relative h-14 md:h-20 rounded-xl transition-all duration-200 border
                    flex flex-col items-center justify-center gap-1 group
                    ${answers[currentQ.id] === val
                      ? 'bg-emerald-600 border-emerald-400 text-white scale-105 shadow-xl shadow-emerald-500/20 z-10'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:border-slate-500'}
                  `}
                >
                  <span className={`text-xl font-bold ${answers[currentQ.id] === val ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {val}
                  </span>
                  {val === 1 && <span className="text-[9px] uppercase tracking-wider absolute bottom-2 opacity-50">Disagree</span>}
                  {val === 5 && <span className="text-[9px] uppercase tracking-wider absolute bottom-2 opacity-50">Agree</span>}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-slate-500 px-2 font-medium tracking-wide">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 pt-8 border-t border-white/5 items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIdx === 0 || isSubmitting}
            className={`text-slate-400 hover:text-white ${currentIdx === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          {currentIdx === totalQ - 1 ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!answers[currentQ.id]}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8"
            >
              {isSubmitting ? 'Analyzing...' : 'Finish Assessment'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="border-slate-600 text-slate-200 hover:border-white hover:text-white"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};