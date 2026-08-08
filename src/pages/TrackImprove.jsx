import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';

export const TrackImprove = () => {
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-[#C9A96E]" /> Candidate Growth Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#050E1A] font-['Outfit']">
            Track & Improve
          </h1>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto font-medium mt-1">
            Historical evaluation analytics and curriculum milestone progression for {candidate.member.name}.
          </p>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] text-center space-y-2">
            <span className="text-3xl font-black font-mono text-[#050E1A]">
              {candidate.signals.missionsCompleted} / 31
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              Missions Completed
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold block">
              {Math.round((candidate.signals.missionsCompleted / 31) * 100)}% Cohort Progress
            </span>
          </div>

          <div className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] text-center space-y-2">
            <span className="text-3xl font-black font-mono text-[#050E1A]">
              {candidate.signals.commitDays} Days
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              Active Commits
            </span>
            <span className="text-[11px] text-[#050E1A] font-semibold block">
              Verified Daily Submissions
            </span>
          </div>

          <div className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] text-center space-y-2">
            <span className="text-3xl font-black font-mono text-[#C9A96E]">
              {candidate.signals.missionsFirstTry}
            </span>
            <span className="text-xs font-bold uppercase text-[#475569] block">
              First Try Passes
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold block">
              High Accuracy Signal
            </span>
          </div>
        </div>

        {/* Action Prompt */}
        <div className="card-surface rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-[#E2D9C8] text-center space-y-4">
          <Award className="w-10 h-10 text-[#071426] mx-auto" />
          <h2 className="text-2xl font-bold text-[#050E1A] font-['Outfit']">
            Take Your Next Adaptive Interview
          </h2>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-lg mx-auto font-medium">
            Test your domain accuracy and systems design reasoning across 10 dynamic evaluation probes.
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

      <Footer />
    </div>
  );
};

export default TrackImprove;
