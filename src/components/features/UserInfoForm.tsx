import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAssessmentStore } from '../../store/assessmentStore';

export const UserInfoForm = () => {
  const setUserInfo = useAssessmentStore((state) => state.setUserInfo);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setUserInfo({ name, email });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="glass-panel p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome</h2>
          <p className="text-slate-300">
            Please enter your details to begin the Temperament Assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full group">
            Start Assessment
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};