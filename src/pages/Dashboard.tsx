import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { TEMPERAMENT_PROFILES } from '../lib/data';
import { generateBlendDescription } from '../lib/logic';
import { Button } from '../components/ui/Button';
import { Search, LogOut, Users, Calendar, Trash2, X, Eye, Filter, Sparkles } from 'lucide-react';
import type { AssessmentRecord, TemperamentType } from '../types';

export const Dashboard = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "assessments"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AssessmentRecord[];

        setAssessments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this record? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, "assessments", id));
        setAssessments(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        alert("Failed to delete record");
      }
    }
  };

  const filteredData = assessments.filter(item => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const recordDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - recordDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === '7days') matchesDate = diffDays <= 7;
      if (dateFilter === '30days') matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesDate;
  });

  // 1. TIMESTAMP FIX: Added Hour/Minute
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 2. TYPE LABEL FIX: Smart Inference
  // If the 'type' field is missing or generic, we guess based on the 'primary' result
  const getRecordType = (record: AssessmentRecord) => {
    if (record.type && record.type !== 'Temperament Test') return record.type;

    const p = record.primary;
    if (p === 'Big Five Profile') return 'Big Five';
    if (['Secure', 'Anxious', 'Avoidant', 'Fearful', 'Fearful-Avoidant'].includes(p as string)) return 'Attachment';
    if (['Words of Affirmation', 'Quality Time', 'Acts of Service', 'Receiving Gifts', 'Physical Touch'].includes(p as string)) return 'Love Languages';
    if (['Avoiding', 'Accommodating', 'Competing', 'Compromising', 'Collaborating'].includes(p as string)) return 'Conflict Style';

    return 'Temperament';
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Therapist Dashboard</h1>
          <p className="text-slate-400">Anchor of Hope Counselling</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => signOut(auth)}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-indigo-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Clients</p>
              <h3 className="text-2xl font-bold text-white">{assessments.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
          <input
            type="text" placeholder="Search clients..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading records...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-white/5 text-slate-300 text-sm uppercase tracking-wider">
                  <th className="p-5 font-medium">Client</th>
                  <th className="p-5 font-medium">Type</th>
                  <th className="p-5 font-medium">Result</th>
                  <th className="p-5 font-medium">Date</th>
                  <th className="p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                {filteredData.map((record) => {
                  const type = getRecordType(record); // Use smart type inference
                  return (
                  <tr key={record.id} onClick={() => setSelectedRecord(record)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="p-5">
                      <div className="font-medium text-white group-hover:text-indigo-300 transition-colors">{record.userName}</div>
                      <div className="text-slate-500 text-xs">{record.userEmail}</div>
                    </td>
                    <td className="p-5">
                      {/* Dynamic Color Badges based on Test Type */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                        type === 'Big Five' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                        type === 'Attachment' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' :
                        type === 'Love Languages' ? 'border-pink-500/30 text-pink-400 bg-pink-500/10' :
                        type === 'Conflict Style' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                        'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                      }`}>
                        {type}
                      </span>
                    </td>
                    <td className="p-5">
                      {type !== 'Temperament' ? (
                        <div className="text-xs text-slate-400">View Full Profile</div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold">{record.primary}</span>
                          <span className="text-slate-500">/</span>
                          <span className="text-slate-400">{record.secondary}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="w-4 h-4" /></button>
                      <button onClick={(e) => handleDelete(e, record.id)} className="p-2 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecord(null)}>
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedRecord(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>

            <div className="p-8">
              <div className="mb-8 border-b border-white/10 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">{selectedRecord.userName}</h2>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Taken on {formatDate(selectedRecord.date)}
                    </p>
                  </div>
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {getRecordType(selectedRecord)}
                  </span>
                </div>
              </div>

              {/* AI Analysis Box */}
              <div className="mb-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-24 h-24 text-indigo-400" /></div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> Psychological Profile</h3>
                {selectedRecord.analysis ? (
                  <div className="text-slate-300 text-sm leading-relaxed space-y-3 relative z-10">
                    {selectedRecord.analysis.split('\n').map((paragraph, idx) => (paragraph.trim() && <p key={idx}>{paragraph}</p>))}
                  </div>
                ) : (
                  (getRecordType(selectedRecord) === "Temperament") ? (
                     <p className="text-slate-300 text-sm leading-relaxed">
                        {generateBlendDescription(selectedRecord.primary as TemperamentType, selectedRecord.secondary as TemperamentType, selectedRecord.isBlend)}
                     </p>
                  ) : <p className="text-slate-500 italic text-sm">No analysis recorded.</p>
                )}
              </div>

              {/* RENDER LOGIC for different test types */}
              {getRecordType(selectedRecord) === "Big Five" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedRecord.scores).map(([trait, score]) => (
                      <div key={trait} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-2"><span className="text-white font-medium">{trait}</span><span className="text-xs text-slate-400">{score} / 20</span></div>
                        <div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(score)/20)*100}%` }} /></div></div>
                      </div>
                  ))}
                </div>
              ) : (getRecordType(selectedRecord) === "Attachment") ? (
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-rose-500/20">
                     <h4 className="text-rose-400 text-sm font-bold uppercase mb-4">Attachment Breakdown</h4>
                     <div className="space-y-4">
                       {Object.entries(selectedRecord.scores).map(([style, score]) => (
                         <div key={style}>
                           <div className="flex justify-between text-sm mb-1"><span className="text-white">{style}</span><span className="text-slate-400">{score} / 30</span></div>
                           <div className="h-2 bg-slate-800 rounded-full"><div className={`h-full rounded-full ${style === selectedRecord.primary ? 'bg-rose-500' : 'bg-slate-600'}`} style={{ width: `${(Number(score) / 30) * 100}%` }} /></div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              ) : getRecordType(selectedRecord) === "Love Languages" ? (
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-pink-500/20">
                     <h4 className="text-pink-400 text-sm font-bold uppercase mb-4">Love Language Breakdown</h4>
                     <div className="space-y-4">
                       {Object.entries(selectedRecord.scores).map(([lang, score]) => (
                         <div key={lang}>
                           <div className="flex justify-between text-sm mb-1"><span className="text-white">{lang}</span><span className="text-slate-400">{score} / 20</span></div>
                           <div className="h-2 bg-slate-800 rounded-full"><div className={`h-full rounded-full ${lang === selectedRecord.primary ? 'bg-pink-500' : 'bg-slate-600'}`} style={{ width: `${(Number(score) / 20) * 100}%` }} /></div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              ) : getRecordType(selectedRecord) === "Conflict Style" ? (
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-orange-500/20">
                     <h4 className="text-orange-400 text-sm font-bold uppercase mb-4">Conflict Style Breakdown</h4>
                     <div className="space-y-4">
                       {Object.entries(selectedRecord.scores).map(([type, score]) => (
                         <div key={type}>
                           <div className="flex justify-between text-sm mb-1"><span className="text-white">{type}</span><span className="text-slate-400">{score} / 20</span></div>
                           <div className="h-2 bg-slate-800 rounded-full"><div className={`h-full rounded-full ${type === selectedRecord.primary ? 'bg-orange-500' : 'bg-slate-600'}`} style={{ width: `${(Number(score) / 20) * 100}%` }} /></div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              ) : (
                /* 3. EMPTY CARD FIX: Only show Strengths/Growth for TEMPERAMENT */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEMPERAMENT_PROFILES[selectedRecord.primary as TemperamentType] && (
                        <>
                        <div className="bg-white/5 p-4 rounded-xl">
                        <h4 className="text-emerald-400 text-xs font-bold uppercase mb-3">Strengths</h4>
                        <ul className="space-y-1">
                            {TEMPERAMENT_PROFILES[selectedRecord.primary as TemperamentType].strengths.map((s: string) => (
                            <li key={s} className="text-slate-300 text-xs flex items-start"><span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />{s}</li>
                            ))}
                        </ul>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                        <h4 className="text-rose-400 text-xs font-bold uppercase mb-3">Growth Areas</h4>
                        <ul className="space-y-1">
                            {TEMPERAMENT_PROFILES[selectedRecord.primary as TemperamentType].growthAreas.map((g: string) => (
                            <li key={g} className="text-slate-300 text-xs flex items-start"><span className="w-1 h-1 bg-rose-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />{g}</li>
                            ))}
                        </ul>
                        </div>
                        </>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw Scores</h4>
                      <div className="flex gap-4">
                        {Object.entries(selectedRecord.scores).map(([type, score]) => (
                          <div key={type} className="flex-1 bg-slate-900/50 p-2 rounded text-center">
                            <div className="text-xs text-slate-500 uppercase">{type.slice(0,3)}</div>
                            <div className="text-lg font-bold text-white">{score}</div>
                          </div>
                        ))}
                      </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};