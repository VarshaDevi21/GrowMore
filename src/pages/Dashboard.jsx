import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  PlayCircle,
  Map,
  CheckSquare,
  AlertCircle,
  Search,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import CompletionRate from '../components/CompletionRate';
import Toast from '../components/Toast';
import {
  getSelectedCandidateId,
  getCandidateById,
  getAllCandidates,
  setSelectedCandidateId,
} from '../data/candidate';

export const Dashboard = () => {
  const navigate = useNavigate();
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);
  const allCandidates = getAllCandidates();

  const [missionFilter, setMissionFilter] = useState('all');
  const [missionSearch, setMissionSearch] = useState('');
  const [toast, setToast] = useState(null);

  if (!candidate) {
    return null;
  }

  const handleCandidateSwitch = (newId) => {
    setSelectedCandidateId(newId);
    setToast({
      message: `Active candidate switched to ${newId}`,
      type: 'info',
    });
  };

  const missions = candidate.missions || [];

  const filteredMissions = missions.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(missionSearch.toLowerCase());
    if (missionFilter === 'passed') return matchesSearch && m.passed === true;
    if (missionFilter === 'skipped') return matchesSearch && m.skipped === true;
    if (missionFilter === 'incomplete') return matchesSearch && !m.passed && !m.skipped;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome Header + Candidate Switcher */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-[#071426] text-[#FFFDF7] px-2.5 py-1 rounded-md">
                {candidate.member.id}
              </span>
              <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Active Candidate
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#050E1A] font-['Outfit']">
              Welcome back, {candidate.member.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#1E293B] font-medium max-w-2xl">
              {candidate.member.jobRole} · {candidate.member.yearsExperience} Years Experience ·{' '}
              {candidate.signals.missionsCompleted} Missions Completed
            </p>
          </div>

          {/* Quick Switcher & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Quick Candidate Switcher Dropdown */}
            <div className="relative">
              <label htmlFor="candidate-select" className="sr-only">Switch Candidate</label>
              <select
                id="candidate-select"
                value={candidate.member.id}
                onChange={(e) => handleCandidateSwitch(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] focus:outline-none focus:border-[#071426] cursor-pointer"
              >
                {allCandidates.map((c) => (
                  <option key={c.member.id} value={c.member.id}>
                    {c.member.id} - {c.member.name} ({c.member.jobRole})
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/interview-setup"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <PlayCircle className="w-4 h-4 text-[#C9A96E]" />
              <span>Start Interview</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Overview: Profile & Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <ProfileCard candidate={candidate} />
          </div>

          <div className="lg:col-span-6">
            <CompletionRate candidate={candidate} />
          </div>
        </div>

        {/* Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#071426] flex items-center justify-center shadow-sm">
                <Map className="w-5 h-5 text-[#FFFDF7]" />
              </div>
              <h2 className="text-lg font-bold text-[#050E1A] font-['Outfit']">
                31-Day Learning Roadmap
              </h2>
              <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                Explore the complete 31-day visual curriculum journey, track completed milestones, and review pending days.
              </p>
            </div>

            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#071426] hover:underline pt-2"
            >
              <span>Open 31-Day Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
            </Link>
          </div>

          <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#071426] flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-[#FFFDF7]" />
              </div>
              <h2 className="text-lg font-bold text-[#050E1A] font-['Outfit']">
                Adaptive AI Interview Sandbox
              </h2>
              <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                Launch a 20-minute adaptive technical interview session grounded in your verified completed missions.
              </p>
            </div>

            <Link
              to="/interview-setup"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#071426] hover:underline pt-2"
            >
              <span>Setup Interview Session</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
            </Link>
          </div>
        </div>

        {/* Real Candidate Missions Table & Filters */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE8DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#071426] flex items-center justify-center text-[#FFFDF7]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#050E1A] font-['Outfit']">
                  Curriculum Mission Telemetry
                </h2>
                <p className="text-xs text-[#475569] font-medium">
                  {candidate.missions.length} Missions Logged in candidates.json
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMissionFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  missionFilter === 'all'
                    ? 'bg-[#071426] text-[#FFFDF7]'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#475569] hover:text-[#050E1A]'
                }`}
              >
                All ({missions.length})
              </button>

              <button
                type="button"
                onClick={() => setMissionFilter('passed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  missionFilter === 'passed'
                    ? 'bg-[#2E7D32] text-[#FFFDF7]'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#2E7D32]'
                }`}
              >
                Passed ({missions.filter((m) => m.passed).length})
              </button>

              <button
                type="button"
                onClick={() => setMissionFilter('skipped')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  missionFilter === 'skipped'
                    ? 'bg-[#D97706] text-[#FFFDF7]'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#D97706]'
                }`}
              >
                Skipped ({missions.filter((m) => m.skipped).length})
              </button>
            </div>
          </div>

          {/* Mission Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={missionSearch}
              onChange={(e) => setMissionSearch(e.target.value)}
              placeholder="Search candidate missions by title (e.g. ChromaDB, FastAPI, LangChain, MCP)..."
              className="w-full rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] px-3.5 py-2.5 pl-9 text-xs text-[#050E1A] font-mono focus:outline-none focus:border-[#071426]"
            />
            <Search className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
          </div>

          {/* Missions List */}
          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredMissions.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#475569] font-mono">
                No missions match the selected filter.
              </div>
            ) : (
              filteredMissions.map((m) => {
                let statusBadge = (
                  <span className="text-[10px] font-mono uppercase bg-[#DC2626]/10 text-[#DC2626] px-2 py-0.5 rounded font-bold">
                    Incomplete
                  </span>
                );

                if (m.passed) {
                  statusBadge = (
                    <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" /> Passed
                    </span>
                  );
                } else if (m.skipped) {
                  statusBadge = (
                    <span className="text-[10px] font-mono uppercase bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Skipped
                    </span>
                  );
                }

                return (
                  <div
                    key={m.day}
                    className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between gap-4 hover:border-[#071426] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] border border-[#E2D9C8] text-[#050E1A] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        D{m.day}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#050E1A] font-['Outfit']">
                          Day {m.day}: {m.title}
                        </h3>
                        <span className="text-[11px] text-[#475569] font-mono">
                          Attempts: {m.attempts} {m.passed ? '· Verified Passed' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">{statusBadge}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default Dashboard;
