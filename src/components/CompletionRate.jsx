import React from 'react';
import { CheckSquare, Calendar, Sparkles, TrendingUp } from 'lucide-react';

export const CompletionRate = ({ candidate }) => {
  if (!candidate || !candidate.signals) return null;

  const totalDays = 31;
  const completed = candidate.signals.missionsCompleted || 0;
  const percentage = Math.round((completed / totalDays) * 100);
  const commitDays = candidate.signals.commitDays || 0;
  const firstTry = candidate.signals.missionsFirstTry || 0;

  return (
    <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#071426] flex items-center justify-center text-[#FFFDF7]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#050E1A] font-['Outfit']">
              Curriculum Progress
            </h3>
            <span className="text-xs font-mono text-[#475569]">Cohort Telemetry</span>
          </div>
        </div>

        <span className="text-sm font-mono font-black text-[#050E1A] bg-[#FAF7F0] px-3 py-1 rounded-xl border border-[#E2D9C8]">
          {percentage}% Done
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold text-[#050E1A]">
          <span>Missions Passed</span>
          <span>
            {completed} / {totalDays} Days
          </span>
        </div>
        <div className="w-full h-3.5 bg-[#FAF7F0] rounded-full overflow-hidden border border-[#E2D9C8] p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#071426] to-[#C9A96E] transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* 3 Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] text-center space-y-1">
          <CheckSquare className="w-4 h-4 text-[#2E7D32] mx-auto" />
          <span className="text-base font-black font-mono text-[#050E1A] block">
            {completed}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#475569] block">
            Passed
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] text-center space-y-1">
          <Calendar className="w-4 h-4 text-[#071426] mx-auto" />
          <span className="text-base font-black font-mono text-[#050E1A] block">
            {commitDays}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#475569] block">
            Commits
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] text-center space-y-1">
          <Sparkles className="w-4 h-4 text-[#C9A96E] mx-auto" />
          <span className="text-base font-black font-mono text-[#050E1A] block">
            {firstTry}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#475569] block">
            First Try
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompletionRate;
