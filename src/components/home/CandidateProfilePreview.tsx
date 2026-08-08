import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  GitCommit,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Layers,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SectionHeading } from '../common/SectionHeading';
import { candidatesData } from '../../utils/dataLoader';

export const CandidateProfilePreview: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const candidates = candidatesData.candidates;
  const currentCandidate = candidates[selectedIdx] || candidates[0];

  const scrollToInterview = () => {
    const el = document.querySelector('#interview-preview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="candidate-profile" className="py-24 relative overflow-hidden bg-[#071426]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Candidate Portfolio Sync"
          badgeIcon={<User className="w-3.5 h-3.5" />}
          title="Verified Cohort"
          highlightedTitle="Candidate Profiles"
          subtitle="Real candidate profiles from candidates.json with actual commit records, mission milestones, and readiness indicators."
        />

        {/* Candidate Switcher Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {candidates.slice(0, 6).map((cand, idx) => (
            <button
              key={cand.member.id}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedIdx === idx
                  ? 'bg-[#C9A96E] text-[#071426] font-bold shadow-lg shadow-[#C9A96E]/20'
                  : 'bg-[#0B1F3A] text-[#C8CDD5] border border-white/10 hover:border-white/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#3A7D44]" />
              <span>{cand.member.name}</span>
              <span className="opacity-70 text-[10px]">({cand.member.id})</span>
            </button>
          ))}
        </div>

        {/* Candidate Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Summary Card */}
          <div className="lg:col-span-5">
            <Card
              variant="glass"
              className="p-6 sm:p-7 border-[#C9A96E]/30 space-y-6 shadow-2xl shadow-[#071426]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16345C] to-[#071426] border border-[#C9A96E]/40 flex items-center justify-center font-bold text-lg text-[#C9A96E] font-mono">
                    {currentCandidate.member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFFDF7] font-['Outfit']">
                      {currentCandidate.member.name}
                    </h3>
                    <p className="text-xs text-[#C9A96E] font-medium">
                      {currentCandidate.member.jobRole}
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {currentCandidate.member.status}
                </Badge>
              </div>

              {/* Attributes */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#071426]/70 border border-white/5">
                  <span className="text-[#8B93A1] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#C9A96E]" /> Education
                  </span>
                  <span className="font-semibold text-[#FFFDF7]">
                    {currentCandidate.member.education}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#071426]/70 border border-white/5">
                  <span className="text-[#8B93A1] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#68D391]" /> Experience
                  </span>
                  <span className="font-semibold text-[#FFFDF7]">
                    {currentCandidate.member.yearsExperience} Years
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#071426]/70 border border-white/5">
                  <span className="text-[#8B93A1] flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-[#C9A96E]" /> Commit Activity
                  </span>
                  <span className="font-mono font-bold text-[#68D391]">
                    {currentCandidate.signals.commitDays} / 31 Days Active
                  </span>
                </div>
              </div>

              {/* Readiness Signals */}
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A96E] mb-2 font-semibold flex items-center justify-between">
                  <span>Candidate Verified Signals</span>
                  <span className="text-[#68D391]">Live Data</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-[#071426]/80 border border-white/5">
                    <span className="text-[10px] text-[#8B93A1] block">Missions Completed</span>
                    <span className="text-base font-bold font-mono text-[#FFFDF7]">
                      {currentCandidate.signals.missionsCompleted}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#071426]/80 border border-white/5">
                    <span className="text-[10px] text-[#8B93A1] block">First-Try Passes</span>
                    <span className="text-base font-bold font-mono text-[#68D391]">
                      {currentCandidate.signals.missionsFirstTry}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="gold"
                size="md"
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={scrollToInterview}
              >
                Launch Interview for {currentCandidate.member.name.split(' ')[0]}
              </Button>
            </Card>
          </div>

          {/* Right Missions & Milestone Log */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1F3A]/70 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C9A96E]" />
                  <h4 className="text-sm font-bold text-[#FFFDF7] font-mono uppercase tracking-wider">
                    Tracked Mission Milestones
                  </h4>
                </div>
                <span className="text-xs text-[#8B93A1]">
                  {currentCandidate.missions.length} Core Milestones Evaluated
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {currentCandidate.missions.map((m) => (
                  <div
                    key={m.day}
                    className="p-3 rounded-xl bg-[#071426]/80 border border-white/5 flex items-center justify-between gap-3 hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#16345C] border border-[#C9A96E]/20 flex items-center justify-center font-mono font-bold text-xs text-[#C9A96E]">
                        D{m.day}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#FFFDF7] block">
                          {m.title}
                        </span>
                        <span className="text-[10px] text-[#8B93A1]">
                          Attempts: {m.attempts !== undefined ? m.attempts : 1}
                        </span>
                      </div>
                    </div>

                    <div>
                      {m.passed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#68D391] bg-[#3A7D44]/20 px-2 py-0.5 rounded border border-[#3A7D44]/30">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      )}
                      {m.skipped && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F6AD55] bg-[#C58B2A]/20 px-2 py-0.5 rounded border border-[#C58B2A]/30">
                          Skipped
                        </span>
                      )}
                      {!m.passed && !m.skipped && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#FC8181] bg-[#B54747]/20 px-2 py-0.5 rounded border border-[#B54747]/30">
                          Needs Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
