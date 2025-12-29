import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { TEMPERAMENT_PROFILES } from '../lib/data';
import { generateBlendDescription } from '../lib/logic';
import { Button } from '../components/ui/Button';
import { Search, LogOut, Users, Calendar, Trash2, X, Eye, Filter, Sparkles } from 'lucide-react';
import type { AssessmentRecord } from '../types';

export const Dashboard = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New States
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "assessments"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AssessmentRecord[];
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Delete Logic
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

  // 3. Filter Logic
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
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto relative">

      {/* Header */}
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

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400" />
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
                  <th className="p-5 font-medium">Result</th>
                  <th className="p-5 font-medium">Scores</th>
                  <th className="p-5 font-medium">Date</th>
                  <th className="p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                {filteredData.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-5">
                      <div className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {record.userName}
                      </div>
                      <div className="text-slate-500 text-xs">{record.userEmail}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold">
                          {record.primary}
                        </span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">{record.secondary}</span>
                      </div>
                      {record.isBlend && <span className="text-xs text-emerald-400 mt-1 block">Co-Dominant</span>}
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 text-xs">
                        {Object.entries(record.scores).map(([key, val]) => (
                          <span key={key} className="bg-slate-800 px-1.5 py-0.5 rounded">
                            {key.charAt(0)}:{val}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, record.id)}
                        className="p-2 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL (UPDATED FOR AI) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecord(null)}>
          <div
            className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-1">{selectedRecord.userName}</h2>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Taken on {formatDate(selectedRecord.date)}
                </p>
              </div>

              {/* AI Analysis Box */}
              <div className="mb-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-indigo-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Psychological Profile
                </h3>

                {selectedRecord.analysis ? (
                  <div className="text-slate-300 text-sm leading-relaxed space-y-3 relative z-10">
                    {selectedRecord.analysis.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  // Fallback for old records without AI data
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {generateBlendDescription(selectedRecord.primary, selectedRecord.secondary, selectedRecord.isBlend)}
                  </p>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="text-emerald-400 text-xs font-bold uppercase mb-3">Strengths</h4>
                    <ul className="space-y-1">
                      {TEMPERAMENT_PROFILES[selectedRecord.primary].strengths.map(s => (
                        <li key={s} className="text-slate-300 text-xs flex items-start">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="text-rose-400 text-xs font-bold uppercase mb-3">Growth Areas</h4>
                    <ul className="space-y-1">
                      {TEMPERAMENT_PROFILES[selectedRecord.primary].growthAreas.map(g => (
                        <li key={g} className="text-slate-300 text-xs flex items-start">
                          <span className="w-1 h-1 bg-rose-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw Scores</h4>
                   <div className="flex gap-4">
                      {Object.entries(selectedRecord.scores).map(([type, score]) => (
                        <div key={type} className="flex-1 bg-slate-900/50 p-2 rounded text-center">
                          <div className="text-xs text-slate-500 uppercase">{type}</div>
                          <div className="text-lg font-bold text-white">{score}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};