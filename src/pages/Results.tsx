import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '../store/assessmentStore';
import { calculateAssessmentResult } from '../lib/logic';
import { TEMPERAMENT_PROFILES } from '../lib/data';
import { saveAssessment } from '../lib/services';
import { getPersonalityAnalysis } from '../lib/gemini';
import { Button } from '../components/ui/Button';
import { RefreshCcw, Download, Loader2 } from 'lucide-react';
import type { TestResult } from '../types';

export const Results = () => {
  const { answers, userInfo, resetAssessment } = useAssessmentStore();
  const [result, setResult] = useState<TestResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const processResults = async () => {
      // SECURITY CHECK: Ensure we have answers, user info, and haven't already processed
      if (Object.keys(answers).length > 0 && !result && userInfo) {

        // 1. Calculate Standard Math (Instant)
        const calculated = calculateAssessmentResult(answers);
        setResult(calculated);

        // 2. Trigger AI Analysis (Async)
        setIsAnalyzing(true);
        const analysisText = await getPersonalityAnalysis(
          userInfo.name,
          calculated.scores,
          calculated.primary,
          calculated.secondary
        );
        setAiAnalysis(analysisText);
        setIsAnalyzing(false);

        // 3. Save to Firebase (Includes AI Analysis)
        if (!isSaving) {
          setIsSaving(true);
          // We combine the calculated result with the AI text
          const finalResult = { ...calculated, analysis: analysisText };
          await saveAssessment(userInfo, finalResult);
          setIsSaving(false);
        }
      }
    };

    processResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, userInfo]);

  if (!result || !userInfo) return null;

  const primaryProfile = TEMPERAMENT_PROFILES[result.primary];
  const secondaryProfile = TEMPERAMENT_PROFILES[result.secondary];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-indigo-400 font-medium mb-2 uppercase tracking-widest text-sm">Assessment Complete</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          Hello, {userInfo.name.split(' ')[0]}
        </h1>

        {/* AI ANALYSIS SECTION */}
        <div className="max-w-3xl mx-auto min-h-[120px]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center p-6 space-y-3 bg-white/5 rounded-xl border border-white/10">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <p className="text-slate-400 text-sm animate-pulse">
                Analyzing your unique score balance...
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-xl text-slate-300 leading-relaxed space-y-4 font-light"
            >
               {/* Split the AI response into paragraphs */}
               {aiAnalysis.split('\n').map((paragraph, idx) => (
                 paragraph.trim() && <p key={idx}>{paragraph}</p>
               ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: The Big Result Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Primary Result */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-indigo-500">
            <h2 className="text-2xl font-serif font-bold text-white mb-4 flex items-center">
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-sans mr-3">Primary</span>
              {result.primary}
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {primaryProfile.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Core Strengths</h4>
                <ul className="space-y-2">
                  {primaryProfile.strengths.map(s => (
                    <li key={s} className="flex items-start text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"/>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">Growth Areas</h4>
                <ul className="space-y-2">
                  {primaryProfile.growthAreas.map(g => (
                    <li key={g} className="flex items-start text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 flex-shrink-0"/>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary Result */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-slate-600">
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center">
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-sans mr-3">Secondary</span>
              {result.secondary}
            </h2>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {secondaryProfile.description}
            </p>
          </div>
        </motion.div>

        {/* Right Column: The Charts & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-6">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(result.scores).map(([type, score]) => {
                const percentage = (score / 20) * 100;
                const isDominant = type === result.primary || type === result.secondary;

                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={isDominant ? "text-white font-medium" : "text-slate-400"}>{type}</span>
                      <span className="text-slate-500">{score} pts</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${isDominant ? 'bg-indigo-500' : 'bg-slate-600'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Your results have been generated. Would you like to save a copy?
            </p>
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Save PDF
            </Button>
            <Button variant="ghost" className="w-full text-slate-500 hover:text-rose-400" onClick={resetAssessment}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};