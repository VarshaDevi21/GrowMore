import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Sparkles,
  UserCheck,
  Wrench,
  Target,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import curriculumData from '../data/curriculum.json';
import {
  getSelectedCandidateId,
  getCandidateById,
  getAllCandidates,
  setSelectedCandidateId,
  getCandidateDayStatus,
} from '../data/candidate';

const staticModules = curriculumData.modules || [];
const staticDays = curriculumData.days || [];

export const Roadmap = () => {
  const navigate = useNavigate();
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);
  const allCandidates = getAllCandidates();

  const [selectedDay, setSelectedDay] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, skipped, incomplete
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Determine candidate missions map for quick lookup
  const candidateMissionsMap = useMemo(() => {
    const map = {};
    if (candidate && candidate.missions) {
      candidate.missions.forEach((m) => {
        map[m.day] = m;
      });
    }
    return map;
  }, [candidate]);

  // Find candidate's current active day (first non-completed day or last day)
  const currentActiveDay = useMemo(() => {
    if (!candidate) return 1;
    for (let d = 1; d <= 31; d++) {
      const status = getCandidateDayStatus(candidate, d);
      if (status !== 'completed') return d;
    }
    return 31;
  }, [candidate]);

  // Calculate statistics
  const stats = useMemo(() => {
    let completed = 0;
    let skipped = 0;
    let incomplete = 0;

    if (candidate) {
      for (let d = 1; d <= 31; d++) {
        const status = getCandidateDayStatus(candidate, d);
        if (status === 'completed') completed++;
        else if (status === 'skipped') skipped++;
        else incomplete++;
      }
    }

    return {
      completed,
      skipped,
      incomplete,
      percentage: Math.round((completed / 31) * 100),
    };
  }, [candidate]);

  // Filter days
  const filteredDays = useMemo(() => {
    if (!candidate) return staticDays;

    return staticDays.filter((day) => {
      const status = getCandidateDayStatus(candidate, day.day);

      // Status filter
      if (filterStatus === 'completed' && status !== 'completed') return false;
      if (filterStatus === 'skipped' && status !== 'skipped') return false;
      if (filterStatus === 'incomplete' && status !== 'not_completed') return false;

      // Module filter
      if (selectedModule !== 'all') {
        const modNum = parseInt(selectedModule, 10);
        const mod = staticModules.find((m) => m.n === modNum);
        if (mod) {
          const [start, end] = mod.days;
          if (day.day < start || day.day > end) return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = day.title.toLowerCase().includes(query);
        const matchesTools = day.tools.some((t) => t.toLowerCase().includes(query));
        const matchesObjectives = day.objectives.some((o) => o.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTools && !matchesObjectives) return false;
      }

      return true;
    });
  }, [candidate, filterStatus, selectedModule, searchQuery]);

  if (!candidate) return null;

  const handleCandidateSwitch = (newId) => {
    setSelectedCandidateId(newId);
    setSelectedDay(null);
    navigate('/roadmap');
  };

  // Helper to find module for a day
  const getModuleForDay = (dayNum) => {
    return staticModules.find((m) => dayNum >= m.days[0] && dayNum <= m.days[1]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header with Candidate Telemetry & Switcher */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-[#071426] text-[#FFFDF7] px-2.5 py-1 rounded-md">
                {candidate.member.id}
              </span>
              <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> {candidate.member.name}
              </span>
              <span className="text-xs font-mono font-bold text-[#C9A96E] bg-[#071426] px-2.5 py-1 rounded-md">
                Active: Day {currentActiveDay}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#050E1A] font-['Outfit']">
              31-Day AI Engineering Roadmap
            </h1>

            <p className="text-xs sm:text-sm text-[#1E293B] font-medium max-w-2xl">
              Candy Crush-inspired visual learning path tracking real candidate mission telemetry from Day 1 to Day 31.
            </p>
          </div>

          {/* Quick Switcher & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <label htmlFor="roadmap-candidate-select" className="sr-only">Switch Candidate</label>
              <select
                id="roadmap-candidate-select"
                value={candidate.member.id}
                onChange={(e) => handleCandidateSwitch(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] focus:outline-none focus:border-[#071426] cursor-pointer"
              >
                {allCandidates.map((c) => (
                  <option key={c.member.id} value={c.member.id}>
                    {c.member.id} - {c.member.name}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/interview-setup"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <PlayCircle className="w-4 h-4 text-[#C9A96E]" />
              <span>Launch Interview</span>
            </Link>
          </div>
        </div>

        {/* Progress & Milestone Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-surface rounded-2xl p-4 sm:p-5 border-2 border-[#E2D9C8] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#050E1A]">
              31
            </span>
            <span className="text-[11px] font-bold uppercase text-[#475569] block">
              Total Days
            </span>
            <span className="text-[10px] font-mono text-[#050E1A] block">8 Modules</span>
          </div>

          <div className="card-surface rounded-2xl p-4 sm:p-5 border-2 border-[#E2D9C8] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32]">
              {stats.completed}
            </span>
            <span className="text-[11px] font-bold uppercase text-[#475569] block">
              Passed Missions
            </span>
            <span className="text-[10px] font-mono text-[#2E7D32] font-bold block">
              {stats.percentage}% Completed
            </span>
          </div>

          <div className="card-surface rounded-2xl p-4 sm:p-5 border-2 border-[#E2D9C8] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#D97706]">
              {stats.skipped}
            </span>
            <span className="text-[11px] font-bold uppercase text-[#475569] block">
              Skipped Days
            </span>
            <span className="text-[10px] font-mono text-[#D97706] block">To Revisit</span>
          </div>

          <div className="card-surface rounded-2xl p-4 sm:p-5 border-2 border-[#E2D9C8] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#DC2626]">
              {stats.incomplete}
            </span>
            <span className="text-[11px] font-bold uppercase text-[#475569] block">
              Incomplete
            </span>
            <span className="text-[10px] font-mono text-[#475569] block">Pending</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="card-surface rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-[#E2D9C8] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-[#071426] text-[#FFFDF7] shadow-sm'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#475569] hover:text-[#050E1A]'
                }`}
              >
                All Days (31)
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('completed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterStatus === 'completed'
                    ? 'bg-[#2E7D32] text-[#FFFDF7] shadow-sm'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#2E7D32]'
                }`}
              >
                Passed ({stats.completed})
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('skipped')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterStatus === 'skipped'
                    ? 'bg-[#D97706] text-[#FFFDF7] shadow-sm'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#D97706]'
                }`}
              >
                Skipped ({stats.skipped})
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('incomplete')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterStatus === 'incomplete'
                    ? 'bg-[#DC2626] text-[#FFFDF7] shadow-sm'
                    : 'bg-[#FAF7F0] border border-[#E2D9C8] text-[#DC2626]'
                }`}
              >
                Pending ({stats.incomplete})
              </button>
            </div>

            {/* Module Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] focus:outline-none focus:border-[#071426] cursor-pointer"
              >
                <option value="all">All 8 Modules</option>
                {staticModules.map((m) => (
                  <option key={m.n} value={m.n}>
                    M{m.n}: {m.title} (Days {m.days[0]}–{m.days[1]})
                  </option>
                ))}
              </select>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools, topics, objectives..."
                  className="w-full rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] px-3.5 py-2 pl-9 text-xs text-[#050E1A] font-medium focus:outline-none focus:border-[#071426]"
                />
                <Search className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CANDY CRUSH / DUOLINGO STYLE VISUAL LEARNING TRAIL */}
        <div className="card-surface rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-[#E2D9C8] bg-[#FAF7F0] relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C9A96E] font-extrabold block">
              Interactive Path Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050E1A] font-['Outfit']">
              The 31-Day Learning Trail
            </h2>
            <p className="text-xs sm:text-sm text-[#1E293B] font-medium">
              Click any level node to view detailed curriculum objectives, configured tools, and candidate telemetry.
            </p>
          </div>

          {/* Module-by-Module Node Progression */}
          <div className="space-y-12 relative max-w-4xl mx-auto">
            {staticModules.map((module) => {
              const moduleDays = filteredDays.filter(
                (d) => d.day >= module.days[0] && d.day <= module.days[1]
              );

              if (moduleDays.length === 0) return null;

              return (
                <div key={module.n} className="space-y-6 relative">
                  {/* Module Milestone Gateway Header */}
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent to-[#E2D9C8]" />
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FFFFFF] border-2 border-[#E2D9C8] shadow-sm">
                      <div className="w-7 h-7 rounded-lg bg-[#071426] text-[#FFFDF7] flex items-center justify-center font-mono font-bold text-xs">
                        M{module.n}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#050E1A] font-['Outfit']">
                          {module.title}
                        </h3>
                        <span className="text-[10px] font-mono text-[#475569]">
                          Days {module.days[0]} – {module.days[1]}
                        </span>
                      </div>
                    </div>
                    <div className="h-0.5 flex-grow bg-gradient-to-l from-transparent to-[#E2D9C8]" />
                  </div>

                  {/* Nodes Grid / Winding Path */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {moduleDays.map((day) => {
                      const status = getCandidateDayStatus(candidate, day.day);
                      const isActiveNode = day.day === currentActiveDay;

                      // Visual theme per node state
                      let nodeBadgeBg = 'bg-[#FFFFFF] text-[#050E1A] border-[#E2D9C8]';
                      let statusIcon = <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />;
                      let statusText = 'Not Completed';

                      if (status === 'completed') {
                        nodeBadgeBg = 'bg-[#2E7D32] text-[#FFFDF7] border-[#2E7D32] shadow-md shadow-[#2E7D32]/20';
                        statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />;
                        statusText = 'Completed';
                      } else if (status === 'skipped') {
                        nodeBadgeBg = 'bg-[#D97706] text-[#FFFDF7] border-[#D97706] shadow-md shadow-[#D97706]/20';
                        statusIcon = <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />;
                        statusText = 'Skipped';
                      } else if (isActiveNode) {
                        nodeBadgeBg = 'bg-[#071426] text-[#FFFDF7] border-[#C9A96E] shadow-xl ring-4 ring-[#C9A96E]/30';
                        statusIcon = <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />;
                        statusText = 'Current Active';
                      }

                      return (
                        <button
                          key={day.day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`rounded-2xl p-5 text-left transition-all relative flex flex-col justify-between cursor-pointer border-2 bg-[#FFFFFF] hover:border-[#071426] hover:shadow-md group ${
                            isActiveNode ? 'border-[#071426] ring-2 ring-[#071426]/10' : 'border-[#E2D9C8]'
                          }`}
                        >
                          {/* Active Candidate Pin Indicator */}
                          {isActiveNode && (
                            <div className="absolute -top-3 right-4 bg-[#071426] text-[#FFFDF7] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#C9A96E] flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                              <span>Candidate Position</span>
                            </div>
                          )}

                          <div>
                            {/* Node Header: Day circle + Type */}
                            <div className="flex items-center justify-between mb-3">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-sm border-2 ${nodeBadgeBg} transition-transform group-hover:scale-105`}
                              >
                                D{day.day}
                              </div>

                              <span className="text-[10px] font-mono uppercase bg-[#FAF7F0] border border-[#E2D9C8] px-2 py-0.5 rounded text-[#050E1A] font-bold">
                                {day.type}
                              </span>
                            </div>

                            {/* Day Title */}
                            <h4 className="text-sm font-bold text-[#050E1A] font-['Outfit'] line-clamp-2 mb-2 group-hover:text-[#071426]">
                              {day.title}
                            </h4>

                            {/* Tools pills (first 2) */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {day.tools.slice(0, 2).map((tool) => (
                                <span
                                  key={tool}
                                  className="text-[10px] font-mono bg-[#FAF7F0] text-[#334155] px-1.5 py-0.5 rounded border border-[#E2D9C8]"
                                >
                                  {tool}
                                </span>
                              ))}
                              {day.tools.length > 2 && (
                                <span className="text-[10px] font-mono text-[#475569] px-1 py-0.5">
                                  +{day.tools.length - 2}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Node Footer: Telemetry state */}
                          <div className="pt-2.5 border-t border-[#EFE8DC] flex items-center justify-between text-[11px] font-mono">
                            <span className="flex items-center gap-1.5 font-bold">
                              {statusIcon}
                              <span className="text-[#050E1A]">{statusText}</span>
                            </span>

                            <span className="text-[#475569] font-medium group-hover:text-[#071426]">
                              Details →
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY DETAILS INTERACTIVE MODAL / DRAWER */}
        <AnimatePresence>
          {selectedDay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25 }}
                className="card-surface rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-[#E2D9C8] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 bg-[#FFFFFF]"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#EFE8DC]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#071426] text-[#FFFDF7] flex items-center justify-center font-mono font-black text-base shadow-md">
                      D{selectedDay.day}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#C9A96E]">
                          {getModuleForDay(selectedDay.day)?.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-[#FAF7F0] border border-[#E2D9C8] px-2 py-0.5 rounded font-bold text-[#050E1A]">
                          {selectedDay.type}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#050E1A] font-['Outfit'] mt-0.5">
                        Day {selectedDay.day}: {selectedDay.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE8DC] text-[#050E1A] cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Candidate Telemetry State */}
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#475569] font-bold block">
                      Candidate Status ({candidate.member.name})
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {getCandidateDayStatus(candidate, selectedDay.day) === 'completed' && (
                        <span className="text-xs font-mono font-bold text-[#2E7D32] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Mission Verified Passed
                        </span>
                      )}
                      {getCandidateDayStatus(candidate, selectedDay.day) === 'skipped' && (
                        <span className="text-xs font-mono font-bold text-[#D97706] flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Mission Skipped
                        </span>
                      )}
                      {getCandidateDayStatus(candidate, selectedDay.day) === 'not_completed' && (
                        <span className="text-xs font-mono font-bold text-[#DC2626] flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Not Completed Yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#475569] block">Attempts Logged</span>
                    <span className="text-sm font-mono font-bold text-[#050E1A]">
                      {candidateMissionsMap[selectedDay.day]?.attempts || 0} Attempts
                    </span>
                  </div>
                </div>

                {/* Tools Applied */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#050E1A] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#071426]" /> Applied Tools & Frameworks
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDay.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Learning Objectives */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#050E1A] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#071426]" /> Core Objectives Checklist
                  </span>
                  <ul className="space-y-2 text-xs text-[#1E293B]">
                    {selectedDay.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8]">
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action: Launch Adaptive Interview on this day */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EFE8DC]">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E2D9C8] text-xs font-bold text-[#050E1A] hover:bg-[#FAF7F0]"
                  >
                    Close
                  </button>

                  <Link
                    to="/interview-setup"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4 text-[#C9A96E]" />
                    <span>Interview on Day {selectedDay.day} Topics</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;
