import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '../store/assessmentStore';
import { verifyAndUseCode } from '../lib/codeService'; // Import verification
import { User, Activity, Brain, Heart, HeartHandshake, Scale, ArrowRight, Lock, Loader2, X } from 'lucide-react';

// ... (Keep existing variants/styles) ...
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
};

export const Home = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useAssessmentStore();

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');

  // NEW: Code Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{ path: string; name: string } | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Initial Click: Check user info, then open modal
  const handleCardClick = (path: string, testName: string) => {
    if (!name || !email) {
      alert("Please enter your name and email first.");
      return;
    }
    // Save user info
    setUserInfo({ name, email });

    // Open Code Modal
    setSelectedTest({ path, name: testName });
    setShowModal(true);
    setAccessCode('');
    setErrorMsg('');
  };

  // 2. Submit Code
  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode) return;

    setVerifying(true);
    setErrorMsg('');

    try {
        const result = await verifyAndUseCode(accessCode, selectedTest?.name || '');

        if (result.valid) {
            // Success! Close modal and go
            setShowModal(false);
            navigate(selectedTest!.path);
        } else {
            setErrorMsg(result.message);
        }
    } catch (err) {
        setErrorMsg("Verification failed. Please try again.");
    } finally {
        setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 selection:bg-indigo-500/30">
       {/* ... (Keep existing Background & Layout) ... */}
       <div className="absolute inset-0 w-full h-full bg-slate-950 -z-20"></div>
       {/* ... Blob animations ... */}

       {/* (Keep Main Content exactly as before, just update onClick handlers) */}

      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible" className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">

        {/* LEFT COLUMN: Welcome & Form */}
        <div className="lg:col-span-5 flex flex-col justify-center">
            {/* ... Logo & Title ... */}
            <motion.div variants={itemVariants} className="mb-8">
             <img src="/logo.png" alt="Anchor of Hope Logo" className="h-20 w-auto mb-6 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
             <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">Begin Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">Journey.</span></h1>
             <p className="text-slate-400 text-lg leading-relaxed max-w-md border-l-2 border-indigo-500/50 pl-4">Anchor of Hope Counselling & Consultancy. <br/>Understand yourself to build a better future.</p>
            </motion.div>

             {/* Form */}
             <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20">
                <div className="space-y-5">
                    <div className="group"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">Full Name</label><div className="relative"><User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50" placeholder="Enter your name" /></div></div>
                    <div className="group"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">Email Address</label><div className="relative"><div className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 flex items-center justify-center">@</div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50" placeholder="Enter your email" /></div></div>
                </div>
             </motion.div>
        </div>

        {/* RIGHT COLUMN: Cards */}
        <div className="lg:col-span-7 flex flex-col justify-center">
             <motion.div variants={itemVariants} className="mb-6 flex items-end justify-between"><h2 className="text-xl text-white font-medium">Select Assessment</h2><div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-1/2"></div></motion.div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AssessmentCard title="Temperament" desc="Discover your personality blend." icon={<Activity className="w-6 h-6" />} color="indigo" onClick={() => handleCardClick('/temperament', 'Temperament')} variants={itemVariants} />
                <AssessmentCard title="Big Five" desc="Measure Openness, Conscientiousness & Stability." icon={<Brain className="w-6 h-6" />} color="emerald" onClick={() => handleCardClick('/big-five', 'Big Five')} variants={itemVariants} />
                <AssessmentCard title="Attachment Style" desc="How you bond, trust, and handle conflict." icon={<Heart className="w-6 h-6" />} color="rose" onClick={() => handleCardClick('/attachment', 'Attachment')} variants={itemVariants} />
                <AssessmentCard title="Love Languages" desc="Identify how you best give and receive love." icon={<HeartHandshake className="w-6 h-6" />} color="pink" onClick={() => handleCardClick('/love-language', 'Love Languages')} variants={itemVariants} />
                <div className="md:col-span-2">
                    <AssessmentCard title="Conflict Resolution" desc="Identify how you manage disagreements." icon={<Scale className="w-6 h-6" />} color="orange" onClick={() => handleCardClick('/conflict-style', 'Conflict Style')} variants={itemVariants} />
                </div>
             </div>
        </div>
      </motion.div>

      {/* --- ACCESS CODE MODAL --- */}
      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
                >
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Enter Access Code</h2>
                        <p className="text-slate-400 mt-2">
                            To start the <span className="text-indigo-400 font-bold">{selectedTest?.name}</span>, please enter the access code provided by your counsellor.
                        </p>
                    </div>

                    <form onSubmit={handleSubmitCode} className="space-y-4">
                        <input
                            autoFocus
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                            placeholder="e.g. A2B3C4"
                            className="w-full text-center text-2xl tracking-widest font-mono bg-slate-950 border border-slate-700 rounded-xl py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase placeholder:text-slate-700"
                        />

                        {errorMsg && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center">
                                {errorMsg}
                            </div>
                        )}

                        <button
                            disabled={verifying || !accessCode}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Assessment"}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// ... (AssessmentCard component remains exactly the same) ...
const AssessmentCard = ({ title, desc, icon, color, onClick, variants }: any) => {
    // ... same as before ...
    const colorStyles: any = {
        indigo: "bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white border-indigo-500/30 group-hover:border-indigo-500/80 group-hover:shadow-indigo-500/20",
        emerald: "bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/30 group-hover:border-emerald-500/80 group-hover:shadow-emerald-500/20",
        rose: "bg-rose-500/20 text-rose-300 group-hover:bg-rose-500 group-hover:text-white border-rose-500/30 group-hover:border-rose-500/80 group-hover:shadow-rose-500/20",
        pink: "bg-pink-500/20 text-pink-300 group-hover:bg-pink-500 group-hover:text-white border-pink-500/30 group-hover:border-pink-500/80 group-hover:shadow-pink-500/20",
        orange: "bg-orange-500/20 text-orange-300 group-hover:bg-orange-500 group-hover:text-white border-orange-500/30 group-hover:border-orange-500/80 group-hover:shadow-orange-500/20",
    };
    const selectedStyle = colorStyles[color] || colorStyles.indigo;
    return (
        <motion.button variants={variants} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={`w-full text-left p-5 rounded-2xl border bg-white/5 backdrop-blur-md transition-all duration-300 group relative overflow-hidden ${selectedStyle.split(' ').filter((c: string) => c.startsWith('border')).join(' ')} hover:shadow-xl hover:bg-white/10`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="flex items-start gap-4 relative z-10"><div className={`p-3 rounded-xl transition-colors duration-300 ${selectedStyle.split(' ').filter((c: string) => !c.startsWith('border') && !c.startsWith('group-hover:shadow')).join(' ')}`}>{icon}</div><div className="flex-1"><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">{title}</h3><ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" /></div><p className="text-sm text-slate-400 mt-1 leading-snug group-hover:text-slate-300 transition-colors">{desc}</p></div></div>
        </motion.button>
    );
};