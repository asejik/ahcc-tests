import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { User, Activity, Brain, Heart, HeartHandshake, Scale } from 'lucide-react';


export const Home = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useAssessmentStore();

  // Local state for form
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');

  const handleStart = (path: string) => {
    if (!name || !email) {
      alert("Please enter your details to proceed.");
      return;
    }
    setUserInfo({ name, email });
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left: Welcome Form */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden">

          {/* Logo Section */}
          <div className="mb-8">
            {/* Replace '/logo.png' with your actual file path in the public folder */}
            <img
              src="/logo.png"
              alt="Anchor of Hope Logo"
              className="h-16 w-auto mb-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'; // Hides image if not found
              }}
            />
            <h1 className="text-4xl font-serif font-bold text-white mb-2">Welcome</h1>
            {/* UPDATED SUBHEADING */}
            <p className="text-slate-400 text-lg">Anchor of Hope Counselling & Consultancy Portal</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 flex items-center justify-center">@</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Test Selection */}
        <div className="space-y-4 flex flex-col justify-center">
          <h2 className="text-xl text-white font-medium mb-2">Select an Assessment</h2>

          <button
            onClick={() => handleStart('/temperament')}
            className="glass-panel p-6 rounded-xl border border-indigo-500/30 hover:border-indigo-500/80 transition-all group text-left flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Temperament Test</h3>
              <p className="text-sm text-slate-400 mt-1">Discover your personality blend (Choleric, Sanguine, etc.)</p>
            </div>
          </button>

          <button
            onClick={() => handleStart('/big-five')}
            className="glass-panel p-6 rounded-xl border border-emerald-500/30 hover:border-emerald-500/80 transition-all group text-left flex items-start gap-4"
          >
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Big Five Personality</h3>
              <p className="text-sm text-slate-400 mt-1">Measure your Openness, Conscientiousness, and Emotional Stability.</p>
            </div>
          </button>

          <button
            onClick={() => handleStart('/attachment')}
            className="glass-panel p-6 rounded-xl border border-rose-500/30 hover:border-rose-500/80 transition-all group text-left flex items-start gap-4"
          >
            <div className="p-3 bg-rose-500/20 rounded-lg text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Attachment Style</h3>
              <p className="text-sm text-slate-400 mt-1">Understand how you bond, trust, and handle conflict in relationships.</p>
            </div>
          </button>

          <button
            onClick={() => handleStart('/love-language')}
            className="glass-panel p-6 rounded-xl border border-pink-500/30 hover:border-pink-500/80 transition-all group text-left flex items-start gap-4"
          >
            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">5 Love Languages</h3>
              <p className="text-sm text-slate-400 mt-1">Identify how you best give and receive love.</p>
            </div>
          </button>

          <button
            onClick={() => handleStart('/conflict-style')}
            className="glass-panel p-6 rounded-xl border border-orange-500/30 hover:border-orange-500/80 transition-all group text-left flex items-start gap-4"
          >
            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Conflict Resolution</h3>
              <p className="text-sm text-slate-400 mt-1">Identify how you manage disagreements and find solutions.</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};