import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { TEMPERAMENT_PROFILES } from '../lib/data';
import { generateBlendDescription } from '../lib/logic';
import { createAccessCode } from '../lib/codeService';
import { Button } from '../components/ui/Button';
import { Search, LogOut, Users, Calendar, Trash2, X, Eye, Filter, Sparkles, Key, Copy, Check, ShieldAlert } from 'lucide-react';
import type { AssessmentRecord, TemperamentType } from '../types';

export const Dashboard = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  // CODES STATE
  const [activeTab, setActiveTab] = useState<'results' | 'codes'>('results');
  const [codes, setCodes] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // GENERATOR STATE
  const [newCodeType, setNewCodeType] = useState('Temperament');
  const [newCodeNote, setNewCodeNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Assessments
      const qAssessments = query(collection(db, "assessments"), orderBy("date", "desc"));
      const snapAssessments = await getDocs(qAssessments);
      setAssessments(snapAssessments.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AssessmentRecord[]);

      // Fetch Codes
      const qCodes = query(collection(db, "access_codes"), orderBy("createdAt", "desc"));
      const snapCodes = await getDocs(qCodes);
      setCodes(snapCodes.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleDeleteCode = async (id: string) => {
    if (window.confirm('Revoke this access code?')) {
        await deleteDoc(doc(db, "access_codes", id));
        setCodes(prev => prev.filter(c => c.id !== id));
    }
  }

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
        // If "MASTER" is selected, we pass -1 for uses and 'All' for type
        if (newCodeType === 'MASTER') {
            await createAccessCode('All', newCodeNote || 'Admin Master Code', -1);
        } else {
            await createAccessCode(newCodeType, newCodeNote, 2);
        }

        setNewCodeNote('');
        fetchData();
    } catch (e) {
        alert("Error generating code");
    } finally {
        setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Therapist Dashboard</h1>
          <p className="text-slate-400">Anchor of Hope Counselling</p>
        </div>

        <div className="flex gap-4">
             {/* NAVIGATION TABS */}
             <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'results' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Results
                </button>
                <button
                    onClick={() => setActiveTab('codes')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'codes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Access Codes
                </button>
             </div>

            <Button variant="secondary" size="sm" onClick={() => signOut(auth)}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
        </div>
      </header>

      {/* --- ACCESS CODES TAB --- */}
      {activeTab === 'codes' ? (
         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Generator Card */}
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-emerald-500">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-400" />
                    Generate New Access Code
                </h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Assessment Type</label>
                        <select
                            value={newCodeType}
                            onChange={(e) => setNewCodeType(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                            <optgroup label="Single Use (2 Uses)">
                                <option value="Temperament">Temperament</option>
                                <option value="Big Five">Big Five Personality</option>
                                <option value="Attachment">Attachment Style</option>
                                <option value="Love Languages">Love Languages</option>
                                <option value="Conflict Style">Conflict Resolution</option>
                            </optgroup>
                            <optgroup label="Admin Only">
                                <option value="MASTER">⭐ MASTER (Unlimited All-Access)</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Client Note (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Admin Master Key"
                            value={newCodeNote}
                            onChange={(e) => setNewCodeNote(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                    <Button
                        onClick={handleGenerateCode}
                        isLoading={isGenerating}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[150px]"
                    >
                        Generate Code
                    </Button>
                </div>
            </div>

            {/* Codes List */}
            <div className="glass-panel rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading codes...</div>
                ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-700 bg-white/5 text-slate-300 text-sm uppercase">
                            <th className="p-5">Code</th>
                            <th className="p-5">Type</th>
                            <th className="p-5">Uses Left</th>
                            <th className="p-5">Note</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                        {codes.map((code) => (
                            <tr key={code.id} className="hover:bg-white/5">
                                <td className="p-5 font-mono text-lg font-bold text-white tracking-wider flex items-center gap-2">
                                    {code.code}
                                    {code.usesLeft === -1 && <ShieldAlert className="w-4 h-4 text-amber-400" title="Master Code" />}
                                </td>
                                <td className="p-5">
                                    <span className={`px-2 py-1 rounded text-xs border ${code.testType === 'All' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                        {code.testType === 'All' ? 'ALL ACCESS' : code.testType}
                                    </span>
                                </td>
                                <td className="p-5">
                                    {code.usesLeft === -1 ? (
                                        <span className="text-xl text-amber-400 font-bold">∞</span>
                                    ) : (
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${code.usesLeft > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            {code.usesLeft} / 2
                                        </span>
                                    )}
                                </td>
                                <td className="p-5 text-slate-500">{code.note || '-'}</td>
                                <td className="p-5 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => copyToClipboard(code.code, code.id)}
                                        className="p-2 bg-indigo-500/10 text-indigo-400 rounded hover:bg-indigo-500/20 transition-colors"
                                        title="Copy Code"
                                    >
                                        {copiedId === code.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCode(code.id)}
                                        className="p-2 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {codes.length === 0 && (
                            <tr><td colSpan={5} className="p-10 text-center text-slate-500">No active access codes.</td></tr>
                        )}
                    </tbody>
                </table>
                )}
            </div>
         </div>
      ) : (

      /* --- RESULTS TAB (Standard View) --- */
      <>
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
          <input
            type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                  const type = getRecordType(record);
                  return (
                  <tr key={record.id} onClick={() => setSelectedRecord(record)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="p-5">
                      <div className="font-medium text-white group-hover:text-indigo-300 transition-colors">{record.userName}</div>
                      <div className="text-slate-500 text-xs">{record.userEmail}</div>
                    </td>
                    <td className="p-5">
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
      </>
      )}

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
                    {selectedRecord.analysis.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  (getRecordType(selectedRecord) === "Temperament") ? (
                     <p className="text-slate-300 text-sm leading-relaxed">
                        {generateBlendDescription(selectedRecord.primary as TemperamentType, selectedRecord.secondary as TemperamentType, selectedRecord.isBlend)}
                     </p>
                  ) : <p className="text-slate-500 italic text-sm">No analysis recorded.</p>
                )}
              </div>

              {/* RENDER LOGIC */}
              {getRecordType(selectedRecord) === "Big Five" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedRecord.scores).map(([trait, score]) => (
                      <div key={trait} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-2"><span className="text-white font-medium">{trait}</span><span className="text-xs text-slate-400">{score} / 20</span></div>
                        <div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(score)/20)*100}%` }} /></div></div>
                      </div>
                  ))}
                </div>
              ) : getRecordType(selectedRecord) === "Attachment" ? (
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