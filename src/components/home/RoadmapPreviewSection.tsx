import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  candidatesData,
  curriculumData,
  getCandidateDayStatus,
  getDayDetails,
} from '../../utils/dataLoader';

export const RoadmapPreviewSection: React.FC = () => {
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [activeDayModal, setActiveDayModal] = useState<number | null>(7); // Default to Day 7 for preview

  const candidate = candidatesData.candidates[selectedCandidateIndex] || candidatesData.candidates[0];
  const allDays = curriculumData.days; // Day 1 to Day 31
  const modules = curriculumData.modules;

  const activeDayData = activeDayModal ? getDayDetails(activeDayModal) : null;
  const activeDayStatus = activeDayModal ? getCandidateDayStatus(candidate, activeDayModal) : 'not_completed';

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="roadmap" className="py-24 relative overflow-hidden bg-[#071426]">
      {/* Background accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#16345C]/30 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Curriculum Alignment"
          badgeIcon={<Calendar className="w-3.5 h-3.5" />}
          title="31-Day Roadmap"
          highlightedTitle="Live Preview"
          subtitle="Direct visualization of Day 1 through Day 31 from curriculum.json, integrated with actual candidate progress tracking."
        />

        {/* Candidate Selector Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-[#0B1F3A]/70 border border-[#C9A96E]/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16345C] border border-[#C9A96E]/30 flex items-center justify-center font-mono font-bold text-xs text-[#C9A96E]">
              {candidate.member.id.replace('CAND-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#FFFDF7]">{candidate.member.name}</span>
                <span className="text-xs text-[#8B93A1]">({candidate.member.jobRole})</span>
              </div>
              <div className="text-[11px] text-[#C8CDD5]">
                {candidate.member.education} · {candidate.member.yearsExperience} YOE · Commit Days: {candidate.signals.commitDays}/31
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs text-[#8B93A1] whitespace-nowrap">Switch Candidate:</span>
            {candidatesData.candidates.slice(0, 4).map((c, idx) => (
              <button
                key={c.member.id}
                onClick={() => setSelectedCandidateIndex(idx)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCandidateIndex === idx
                    ? 'bg-[#C9A96E] text-[#071426] font-bold shadow-md shadow-[#C9A96E]/20'
                    : 'bg-[#071426] text-[#C8CDD5] border border-white/10 hover:border-white/20'
                }`}
              >
                {c.member.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 31-Day Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-2.5 sm:gap-3 mb-10">
          {allDays.map((dayItem) => {
            const status = getCandidateDayStatus(candidate, dayItem.day);
            const isSelected = activeDayModal === dayItem.day;

            return (
              <motion.button
                key={dayItem.day}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveDayModal(dayItem.day)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[90px] relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-[#C9A96E] bg-[#16345C] border-[#C9A96E]'
                    : status === 'completed'
                    ? 'bg-[#0B1F3A]/80 border-[#3A7D44]/40 hover:border-[#3A7D44]'
                    : status === 'skipped'
                    ? 'bg-[#0B1F3A]/80 border-[#C58B2A]/40 hover:border-[#C58B2A]'
                    : 'bg-[#071426]/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#FFFDF7]">
                    Day {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                  </span>
                  {status === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3A7D44]" />
                  )}
                  {status === 'skipped' && (
                    <AlertCircle className="w-3.5 h-3.5 text-[#C58B2A]" />
                  )}
                  {status === 'not_completed' && (
                    <Clock className="w-3.5 h-3.5 text-[#8B93A1]" />
                  )}
                </div>

                <div className="text-[10px] text-[#C8CDD5] font-medium line-clamp-2 leading-tight mt-1">
                  {dayItem.title}
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#8B93A1]">
                    {dayItem.type}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === 'completed'
                        ? 'bg-[#3A7D44]'
                        : status === 'skipped'
                        ? 'bg-[#C58B2A]'
                        : 'bg-[#8B93A1]'
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Day Detailed Inspector */}
        {activeDayData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-7 rounded-2xl bg-[#0B1F3A] border border-[#C9A96E]/30 shadow-2xl shadow-[#071426] mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16345C] to-[#071426] border border-[#C9A96E]/40 flex items-center justify-center text-base font-bold font-mono text-[#C9A96E]">
                  D{activeDayData.day}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase bg-[#16345C] text-[#C9A96E] px-2 py-0.5 rounded border border-white/10">
                      {activeDayData.type}
                    </span>
                    <Badge
                      variant={
                        activeDayStatus === 'completed'
                          ? 'success'
                          : activeDayStatus === 'skipped'
                          ? 'warning'
                          : 'muted'
                      }
                    >
                      {activeDayStatus === 'completed'
                        ? 'Completed in Cohort'
                        : activeDayStatus === 'skipped'
                        ? 'Skipped by Candidate'
                        : 'Not Completed'}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-[#FFFDF7] mt-1 font-['Outfit']">
                    {activeDayData.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => scrollToSection('#interview-preview')}
                >
                  Simulate Probe for Day {activeDayData.day}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] mb-2 font-semibold">
                  Tools & Technologies (Real Data)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDayData.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#071426] border border-white/10 text-xs font-mono text-[#FFFDF7]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] mb-2 font-semibold">
                  Day Learning Objectives
                </h4>
                <ul className="space-y-1.5 text-xs text-[#C8CDD5]">
                  {activeDayData.objectives.slice(0, 3).map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Explore Full Roadmap CTA */}
        <div className="text-center pt-2">
          <Button
            variant="outline"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => scrollToSection('#roadmap')}
            className="border-[#C9A96E]/50 hover:bg-[#16345C]"
          >
            Explore Full 31-Day Roadmap (All 8 Modules)
          </Button>
        </div>
      </div>
    </section>
  );
};
