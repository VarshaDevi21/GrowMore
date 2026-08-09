import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bot,
  PlayCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Layers,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';

export const InterviewSetup = () => {
  const navigate = useNavigate();
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);

  const [difficulty, setDifficulty] = useState('Medium');

  // Listen for completed interview from popup and redirect normal window to /report
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'last_interview_report' && e.newValue) {
        navigate('/report');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  if (!candidate) return null;

  const handleStartInterview = () => {
    localStorage.setItem('interview_starting_difficulty', difficulty);

    // Clear previous report so storage event fires cleanly on new submission
    localStorage.removeItem('last_interview_report');

    const width = Math.min(window.screen.availWidth, 1400);
    const height = Math.min(window.screen.availHeight, 950);
    const left = Math.max(0, (window.screen.availWidth - width) / 2);
    const top = Math.max(0, (window.screen.availHeight - height) / 2);

    const interviewWin = window.open(
      '/interview',
      'GrowMore_Interview_Sandbox',
      `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!interviewWin || interviewWin.closed || typeof interviewWin.closed === 'undefined') {
      // If popup blocker intercepts, fallback to current window
      navigate('/interview');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Evaluation Calibration Sandbox
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#050E1A] font-['Outfit']">
            Technical Interview Setup
          </h1>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-lg mx-auto font-medium mt-1">
            Configure session parameters for {candidate.member.name} ({candidate.member.id}) before launching the isolated sandbox.
          </p>
        </div>

        {/* 2-Column Setup Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Candidate & Parameters (7 cols) */}
          <div className="lg:col-span-7 card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6">
            {/* Candidate Identity */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#071426] text-[#FFFDF7] flex items-center justify-center font-mono font-bold text-xs">
                  {candidate.member.id.replace('CAND-', '#')}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#050E1A] font-['Outfit']">
                    {candidate.member.name}
                  </h2>
                  <p className="text-xs font-mono text-[#475569]">
                    {candidate.member.jobRole} · {candidate.member.yearsExperience} YOE
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            {/* Starting Difficulty Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#050E1A] block">
                  Starting Difficulty Level
                </span>
                <span className="text-[11px] font-mono text-[#475569]">
                  Adapts in real-time
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Easy', label: 'Foundational', sub: 'Core Python & APIs' },
                  { id: 'Medium', label: 'Applied', sub: 'Vector & RAG Architectures' },
                  { id: 'Hard', label: 'Principal', sub: 'Distributed MCP & Scale' },
                ].map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDifficulty(lvl.id)}
                      className={`p-3.5 rounded-2xl text-left font-mono transition-all cursor-pointer border-2 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#071426] text-[#FFFDF7] border-[#071426] shadow-md'
                          : 'bg-[#FAF7F0] border-[#E2D9C8] text-[#050E1A] hover:border-[#071426]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{lvl.id}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />}
                      </div>
                      <span className={`text-[10px] block ${isSelected ? 'text-[#C8CDD5]' : 'text-[#475569]'}`}>
                        {lvl.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Core Evaluation Rules */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase font-bold text-[#050E1A] block">
                Session Evaluation Rules
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#050E1A]">
                    <HelpCircle className="w-4 h-4 text-[#071426]" />
                    <span>10 Questions Maximum</span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Deterministic cross-module probes spanning 8 distinct cohort days.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#050E1A]">
                    <Clock className="w-4 h-4 text-[#071426]" />
                    <span>20-Minute Focus Limit</span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Timed sandbox with 3-strike focus switch protection.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#2E7D32]">
                    <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
                    <span>Adaptive Scaling</span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    Difficulty dynamically adjusts based on architectural depth and precision.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#C9A96E]">
                    <Layers className="w-4 h-4 text-[#C9A96E]" />
                    <span>Curriculum Grounded</span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    100% tied to completed missions in candidates.json from Day 1 to Day 31.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Launch Box & Readiness (5 cols) */}
          <div className="lg:col-span-5 card-surface rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-[#E2D9C8] space-y-6">
            <div className="text-center pb-4 border-b border-[#EFE8DC]">
              <div className="w-14 h-14 rounded-2xl bg-[#071426] flex items-center justify-center mx-auto mb-3 shadow-md">
                <Bot className="w-7 h-7 text-[#FFFDF7]" />
              </div>
              <h3 className="text-xl font-black text-[#050E1A] font-['Outfit']">
                AI Evaluator Ready
              </h3>
              <p className="text-xs text-[#475569] font-mono mt-0.5">
                Launches in dedicated separate window
              </p>
            </div>

            {/* Quick Readiness Summary */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex justify-between">
                <span className="text-[#475569]">Candidate:</span>
                <span className="font-bold text-[#050E1A]">{candidate.member.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex justify-between">
                <span className="text-[#475569]">Starting Tier:</span>
                <span className="font-mono font-bold text-[#071426]">{difficulty}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex justify-between">
                <span className="text-[#475569]">Evaluation Probes:</span>
                <span className="font-mono font-bold text-[#050E1A]">10 Questions</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex justify-between">
                <span className="text-[#475569]">Allocated Time:</span>
                <span className="font-mono font-bold text-[#2E7D32]">20 Minutes</span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleStartInterview}
                className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <PlayCircle className="w-4 h-4 text-[#C9A96E]" />
                <span>Start Interview </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A96E]" />
              </button>

              <div className="text-center">
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-[#475569] hover:text-[#050E1A] hover:underline"
                >
                  ← Return to Candidate Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewSetup;
