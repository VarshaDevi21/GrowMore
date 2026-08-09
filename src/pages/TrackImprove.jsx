import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Award,
  ArrowRight,
  History,
  Target,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Sparkles,
  BookOpen,
  UserCheck,
  ChevronRight,
  Filter,
  Trash2,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { SkeletonCard } from '../components/SkeletonLoader';
import {
  getSelectedCandidateId,
  getCandidateById,
  getAllCandidates,
  setSelectedCandidateId,
} from '../data/candidate';
import {
  getCandidateHistory,
  clearCandidateHistory,
  deleteHistoryItem,
} from '../services/historyService';

export const TrackImprove = () => {
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);
  const allCandidates = getAllCandidates();

  const [activeTab, setActiveTab] = useState('history'); // history | mastery | actionPlan
  const [historyFilter, setHistoryFilter] = useState('all'); // all | high | medium | low
  const [toast, setToast] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load completed actions from localStorage per candidate
  const [completedActions, setCompletedActions] = useState(() => {
    if (!candidateId) return {};
    try {
      const saved = localStorage.getItem(`growmore_actions_${candidateId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reload history when candidate changes
  const [pastAttempts, setPastAttempts] = useState([]);

  useEffect(() => {
    if (!candidateId) return;
    setIsLoading(true);
    const history = getCandidateHistory(candidateId);
    setPastAttempts(history);
    setIsLoading(false);
  }, [candidateId]);

  // Sync actions with localStorage
  const toggleAction = (id) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`growmore_actions_${candidateId}`, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save action state:', err);
      }
      setToast({
        message: updated[id] ? 'Study action item marked as complete!' : 'Action item uncompleted.',
        type: 'success',
      });
      return updated;
    });
  };

  const handleCandidateSwitch = (newId) => {
    setSelectedCandidateId(newId);
    setToast({
      message: `Switched active candidate to ${newId}`,
      type: 'info',
    });
  };

  const handleClearHistory = () => {
    if (!candidateId) return;
    clearCandidateHistory(candidateId);
    setPastAttempts([]);
    setShowClearConfirm(false);
    setToast({
      message: `Evaluation history cleared for ${candidateId}`,
      type: 'info',
    });
  };

  const handleDeleteItem = (attemptId) => {
    deleteHistoryItem(candidateId, attemptId);
    setPastAttempts((prev) => prev.filter((item) => item.id !== attemptId));
    setToast({
      message: 'Evaluation log entry removed',
      type: 'success',
    });
  };

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'high') return pastAttempts.filter((a) => a.score >= 85);
    if (historyFilter === 'medium') return pastAttempts.filter((a) => a.score >= 70 && a.score < 85);
    if (historyFilter === 'low') return pastAttempts.filter((a) => a.score < 70);
    return pastAttempts;
  }, [pastAttempts, historyFilter]);

  // Skill Mastery by Module
  const moduleMastery = useMemo(() => {
    // Dynamically score based on past attempts if available
    const avgScore = pastAttempts.length
      ? Math.round(pastAttempts.reduce((acc, curr) => acc + curr.score, 0) / pastAttempts.length)
      : 85;

    return [
      { id: 1, title: 'Environment & Tooling', days: 'Days 1–3', score: Math.min(98, avgScore + 6), status: 'Mastered' },
      { id: 2, title: 'Data Foundations', days: 'Days 4–6', score: Math.min(95, avgScore + 3), status: 'Proficient' },
      { id: 3, title: 'Embeddings & Vector Search', days: 'Days 7–10', score: Math.min(92, avgScore), status: 'Proficient' },
      { id: 4, title: 'LLM Core & Prompting', days: 'Days 11–15', score: Math.min(96, avgScore + 4), status: 'Mastered' },
      { id: 5, title: 'Chatbot Application Build', days: 'Days 16–20', score: Math.max(75, avgScore - 4), status: 'Proficient' },
      { id: 6, title: 'Agentic AI & MCP', days: 'Days 21–24', score: Math.min(94, avgScore + 2), status: 'Mastered' },
      { id: 7, title: 'Security & Deployment', days: 'Days 25–28', score: Math.max(70, avgScore - 8), status: 'Developing' },
      { id: 8, title: 'Production & Capstone', days: 'Days 29–31', score: Math.min(90, avgScore - 1), status: 'Proficient' },
    ];
  }, [pastAttempts]);

  const actionItems = useMemo(
    () => [
      { id: 'act-1', day: 10, title: 'Practice SQLite Full-Text + ChromaDB RRF Fusion', area: 'Embeddings & Vectors' },
      { id: 'act-2', day: 23, title: 'Build custom MCP tool server with Pydantic validation', area: 'Agentic AI & MCP' },
      { id: 'act-3', day: 28, title: 'Audit gVisor / Wasm container security guardrails', area: 'Security & Deployment' },
      { id: 'act-4', day: 18, title: 'Optimize FastAPI WebSockets token backpressure handling', area: 'Chatbot Architecture' },
    ],
    []
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col justify-center items-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mb-3" />
        <h2 className="text-xl font-bold font-['Outfit']">Candidate Session Not Found</h2>
        <p className="text-xs text-[#475569] max-w-sm mt-1 mb-4">
          Select a candidate profile from the candidate directory to inspect growth telemetry.
        </p>
        <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-[#071426] text-[#FFFDF7] font-mono text-xs font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const missionsPercent = Math.round((candidate.signals.missionsCompleted / 31) * 100);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main
        className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8"
        role="main"
        aria-label="Candidate Track & Improve Telemetry"
      >
        {/* Header with Switcher */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-[#071426] text-[#FFFDF7] px-2.5 py-1 rounded-md">
                {candidate.member.id}
              </span>
              <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> {candidate.member.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#050E1A] font-['Outfit']">
              Track & Improve Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">
              Historical evaluation performance, module mastery scores, and target curriculum growth plans.
            </p>
          </div>

          {/* Candidate Switcher Dropdown */}
          <div className="shrink-0 space-y-1.5 w-full md:w-auto">
            <label htmlFor="telemetry-candidate-select" className="text-[11px] font-mono uppercase font-bold text-[#475569] block">
              Active Telemetry Profile
            </label>
            <select
              id="telemetry-candidate-select"
              value={candidate.member.id}
              onChange={(e) => handleCandidateSwitch(e.target.value)}
              className="w-full md:w-60 px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] focus:outline-none focus:border-[#071426] focus-visible:ring-2 focus-visible:ring-[#C9A96E] cursor-pointer"
            >
              {allCandidates.map((c) => (
                <option key={c.member.id} value={c.member.id}>
                  {c.member.name} ({c.member.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card-surface rounded-3xl p-5 shadow-sm border-2 border-[#E2D9C8] space-y-1 text-center">
            <span className="text-3xl font-black font-mono text-[#050E1A]">
              {candidate.signals.missionsCompleted} / 31
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              Missions Completed
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold block">
              {missionsPercent}% Cohort Mastery
            </span>
          </div>

          <div className="card-surface rounded-3xl p-5 shadow-sm border-2 border-[#E2D9C8] space-y-1 text-center">
            <span className="text-3xl font-black font-mono text-[#050E1A]">
              {pastAttempts.length} Sessions
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              Evaluations Taken
            </span>
            <span className="text-[11px] text-[#050E1A] font-semibold block">
              Avg Score: {pastAttempts.length ? Math.round(pastAttempts.reduce((acc, curr) => acc + curr.score, 0) / pastAttempts.length) : 0}%
            </span>
          </div>

          <div className="card-surface rounded-3xl p-5 shadow-sm border-2 border-[#E2D9C8] space-y-1 text-center">
            <span className="text-3xl font-black font-mono text-[#C9A96E]">
              {candidate.signals.missionsFirstTry}
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              First-Try Passes
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold block">
              High Precision Accuracy
            </span>
          </div>

          <div className="card-surface rounded-3xl p-5 shadow-sm border-2 border-[#E2D9C8] space-y-1 text-center">
            <span className="text-3xl font-black font-mono text-[#2E7D32]">
              {candidate.signals.commitDays} Days
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              Active Commits
            </span>
            <span className="text-[11px] text-[#475569] font-semibold block">
              Verified Daily Activity
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-[#E2D9C8] gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Telemetry Navigation Tabs">
          {[
            { id: 'history', label: 'Evaluation History', icon: History },
            { id: 'mastery', label: 'Module Mastery (1–8)', icon: BarChart3 },
            { id: 'actionPlan', label: 'Actionable Study Plan', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-2 focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                  isActive
                    ? 'bg-[#071426] text-[#FFFDF7] border-[#071426] shadow-sm'
                    : 'bg-[#FAF7F0] text-[#475569] border-transparent hover:border-[#E2D9C8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A96E]' : 'text-[#475569]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Evaluation History */}
        {activeTab === 'history' && (
          <motion.div
            id="tabpanel-history"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Filter & Manage Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#E2D9C8]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#050E1A]">
                <Filter className="w-4 h-4 text-[#071426]" /> Filter History:
                <div className="flex items-center gap-1.5 flex-wrap ml-2">
                  {[
                    { id: 'all', label: 'All Sessions' },
                    { id: 'high', label: 'Score ≥ 85%' },
                    { id: 'medium', label: '70%–84%' },
                    { id: 'low', label: '< 70%' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setHistoryFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold cursor-pointer border transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                        historyFilter === f.id
                          ? 'bg-[#071426] text-[#FFFDF7] border-[#071426]'
                          : 'bg-[#FAF7F0] text-[#475569] border-[#E2D9C8] hover:border-[#071426]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {pastAttempts.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/30 hover:bg-[#DC2626] hover:text-[#FFFDF7] transition-colors cursor-pointer flex items-center gap-1.5 justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear History
                </button>
              )}
            </div>

            {/* Past Attempts Cards */}
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="card-surface rounded-3xl p-8 text-center border-2 border-[#E2D9C8] space-y-3 bg-[#FFFFFF]">
                <History className="w-10 h-10 text-[#475569] mx-auto opacity-50" />
                <h3 className="text-base font-bold font-['Outfit'] text-[#050E1A]">No evaluation records found</h3>
                <p className="text-xs text-[#475569] max-w-sm mx-auto">
                  Launch a new technical interview sandbox to record your first diagnostic evaluation session.
                </p>
                <Link
                  to="/interview-setup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071426] text-[#FFFDF7] font-mono text-xs font-bold shadow-md"
                >
                  Start Evaluation Sandbox <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] space-y-3 bg-[#FFFFFF] hover:border-[#071426] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFE8DC]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#071426]" />
                        <span className="text-xs font-mono font-extrabold text-[#050E1A]">{attempt.date}</span>
                        <span className="text-[10px] font-mono uppercase bg-[#071426] text-[#FFFDF7] px-2 py-0.5 rounded font-bold">
                          Tier: {attempt.tier}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#475569]">
                          {attempt.daysCovered?.length || 10} Days Tested
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[#2E7D32] font-mono font-black text-sm">
                          {attempt.score}/100
                        </span>
                        <button
                          onClick={() => handleDeleteItem(attempt.id)}
                          className="p-1 rounded-lg text-[#475569] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"
                          title="Delete entry"
                          aria-label={`Delete interview attempt from ${attempt.date}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#1E293B] font-medium leading-relaxed">{attempt.summary}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(attempt.daysCovered || [3, 7, 10, 23]).map((d) => (
                          <span
                            key={d}
                            className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F0] border border-[#E2D9C8] text-[10px] font-mono font-bold text-[#050E1A]"
                          >
                            Day {d}
                          </span>
                        ))}
                      </div>

                      <Link
                        to="/report"
                        className="text-xs font-mono font-bold text-[#071426] hover:text-[#C9A96E] flex items-center gap-1 hover:underline"
                      >
                        View Scorecard <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Module Mastery */}
        {activeTab === 'mastery' && (
          <motion.div
            id="tabpanel-mastery"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
              <div>
                <h3 className="text-lg font-extrabold text-[#050E1A] font-['Outfit']">8-Module Curriculum Mastery</h3>
                <p className="text-xs font-mono text-[#475569]">Calibrated across 31-day AI engineering cohort missions</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-lg">
                Overall: {missionsPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleMastery.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#050E1A] font-['Outfit'] text-sm">
                      M{m.id}: {m.title}
                    </span>
                    <span className="font-mono text-[#071426]">{m.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#E2D9C8]">
                    <div className="h-full bg-gradient-to-r from-[#071426] to-[#C9A96E]" style={{ width: `${m.score}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#475569]">
                    <span>{m.days}</span>
                    <span className="font-bold text-[#2E7D32]">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Actionable Study Plan */}
        {activeTab === 'actionPlan' && (
          <motion.div
            id="tabpanel-actionPlan"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
              <div>
                <h3 className="text-lg font-extrabold text-[#050E1A] font-['Outfit']">Curriculum Improvement Checklist</h3>
                <p className="text-xs font-mono text-[#475569]">Targeted practice tasks grounded in candidate evaluation telemetry</p>
              </div>
              <span className="text-xs font-mono text-[#050E1A] font-bold">
                {Object.values(completedActions).filter(Boolean).length} / {actionItems.length} Solved
              </span>
            </div>

            <div className="space-y-3">
              {actionItems.map((act) => {
                const isChecked = !!completedActions[act.id];
                return (
                  <div
                    key={act.id}
                    onClick={() => toggleAction(act.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'bg-[#2E7D32]/5 border-[#2E7D32]/40 text-[#2E7D32]'
                        : 'bg-[#FFFFFF] border-[#E2D9C8] text-[#050E1A] hover:border-[#071426]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-bold text-xs ${
                          isChecked ? 'bg-[#2E7D32] border-[#2E7D32] text-[#FFFDF7]' : 'border-[#E2D9C8] bg-[#FAF7F0]'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${isChecked ? 'line-through opacity-80' : ''}`}>
                          Day {act.day}: {act.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#475569]">{act.area}</span>
                      </div>
                    </div>

                    <Link
                      to="/roadmap"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-[11px] font-mono font-bold text-[#071426] hover:bg-[#071426] hover:text-[#FFFDF7]"
                    >
                      Study Day {act.day} →
                    </Link>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Prompt */}
        <div className="card-surface rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-[#E2D9C8] text-center space-y-4 bg-[#FFFFFF]">
          <Award className="w-10 h-10 text-[#071426] mx-auto" />
          <h2 className="text-2xl font-bold text-[#050E1A] font-['Outfit']">
            Ready to Validate Improvements?
          </h2>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-lg mx-auto font-medium">
            Launch a new technical evaluation sandbox to test your progress across updated curriculum topics.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/interview-setup"
              className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
            >
              <span>Launch Interview Sandbox</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Clearing History */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFFFF] rounded-3xl p-6 max-w-md w-full border-2 border-[#E2D9C8] space-y-4 shadow-xl text-center"
            >
              <Trash2 className="w-10 h-10 text-[#DC2626] mx-auto" />
              <h3 className="text-lg font-bold font-['Outfit'] text-[#050E1A]">Clear Evaluation History?</h3>
              <p className="text-xs text-[#475569]">
                Are you sure you want to clear all evaluation logs for candidate {candidateId}? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#E2D9C8] text-[#050E1A] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#DC2626] text-[#FFFDF7] hover:bg-[#B91C1C] cursor-pointer"
                >
                  Confirm Clear
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default TrackImprove;
