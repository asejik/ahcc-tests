import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CONFLICT_STYLE_QUESTIONS, CONFLICT_STYLE_DESCRIPTIONS, type ConflictStyleType } from '../lib/conflictStyleData';
import { calculateConflictStyleScores, generateConflictStylePrompt } from '../lib/conflictStyleLogic';
import { getGenericAnalysis } from '../lib/gemini';
import { saveAssessment } from '../lib/services';
import { useAssessmentStore } from '../store/assessmentStore';
import { Button } from '../components/ui/Button';
import { ArrowRight, ArrowLeft, Download, RefreshCcw, Scale } from 'lucide-react';

export const ConflictStyleTest = () => {
  const navigate = useNavigate();
  const { userInfo } = useAssessmentStore();

  const [answers, setAnswers] = useState<Record<number, ConflictStyleType>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    if (!userInfo) navigate('/');
  }, [userInfo, navigate]);

  if (!userInfo) return null;

  const currentQ = CONFLICT_STYLE_QUESTIONS[currentIdx];
  const totalQ = CONFLICT_STYLE_QUESTIONS.length;
  const progress = ((currentIdx + 1) / totalQ) * 100;

  const handleSelect = (value: ConflictStyleType) => {
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
      const calculated = calculateConflictStyleScores(answers);
      const aiPrompt = generateConflictStylePrompt(userInfo.name, calculated);
      const aiAnalysis = await getGenericAnalysis(aiPrompt);

      const fullResult = {
        primary: calculated.primary,
        secondary: calculated.secondary,
        scores: calculated.scores,
        isBlend: false,
        analysis: aiAnalysis,
        type: "Conflict Style"
      };

      await saveAssessment(userInfo, fullResult as any);
      setResultData(fullResult);

    } catch (error) {
      console.error(error);
      alert("Error saving results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RESULT VIEW ---
  if (resultData) {
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-orange-400 font-medium mb-2 uppercase tracking-widest text-sm">Assessment Complete</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Conflict Style Profile</h1>

          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{resultData.primary}</h2>
            <p className="text-orange-300 font-medium">Secondary: {resultData.secondary}</p>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
              {CONFLICT_STYLE_DESCRIPTIONS[resultData.primary as ConflictStyleType]}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 text-left relative">
            <Scale className="absolute top-4 right-4 text-orange-500/20 w-12 h-12" />
            <div className="text-lg text-slate-300 leading-relaxed space-y-4">
               {resultData.analysis.split('\n').map((p: string, i: number) =>
                 p.trim() && <p key={i}>{p}</p>
               )}
            </div>
          </div>
        </motion.div>

        {/* Score Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          {Object.entries(resultData.scores).map(([type, score]) => (
            <div key={type} className={`glass-panel p-5 rounded-xl border-l-4 ${type === resultData.primary ? 'border-orange-500 bg-orange-500/5' : 'border-slate-600'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${type === resultData.primary ? 'text-white' : 'text-slate-400'}`}>{type}</span>
                <span className="text-xs text-slate-500">{score as number} / 20</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full">
                <div
                  className={`h-full rounded-full ${type === resultData.primary ? 'bg-orange-500' : 'bg-slate-600'}`}
                  style={{ width: `${(Number(score) / 20) * 100}%` }}
                />
              </div>
            </div>
          ))}
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

  // --- QUESTION VIEW ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-3xl mx-auto pt-20">
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Question {currentIdx + 1} of {totalQ}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

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
            <h2 className="text-2xl md:text-3xl font-serif text-white text-center mb-10 leading-relaxed">
              {currentQ.text}
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    text-left p-4 rounded-xl transition-all duration-200 border
                    ${answers[currentQ.id] === option.value
                      ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:border-slate-500'}
                  `}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-8 border-t border-white/5 items-center">
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
              className="bg-orange-600 hover:bg-orange-500 text-white px-8"
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