import React from 'react';
import { User, Briefcase, Calendar, GraduationCap, ShieldCheck } from 'lucide-react';

export const ProfileCard = ({ candidate }) => {
  if (!candidate || !candidate.member) return null;

  return (
    <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#071426] flex items-center justify-center text-[#FFFDF7] font-bold text-xs">
            {candidate.member.id.replace('CAND-', '#')}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#050E1A] font-['Outfit']">
              Candidate Profile
            </h3>
            <span className="text-xs font-mono text-[#475569]">{candidate.member.id}</span>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1 rounded-full font-bold">
          {candidate.member.status}
        </span>
      </div>

      {/* Details List */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
          <span className="text-[#475569] flex items-center gap-2 font-medium">
            <User className="w-4 h-4 text-[#071426]" /> Full Name
          </span>
          <span className="font-bold text-[#050E1A]">{candidate.member.name}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
          <span className="text-[#475569] flex items-center gap-2 font-medium">
            <Briefcase className="w-4 h-4 text-[#071426]" /> Job Role
          </span>
          <span className="font-bold text-[#050E1A]">{candidate.member.jobRole}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
          <span className="text-[#475569] flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-[#071426]" /> Experience
          </span>
          <span className="font-bold text-[#050E1A]">{candidate.member.yearsExperience} Years</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
          <span className="text-[#475569] flex items-center gap-2 font-medium">
            <GraduationCap className="w-4 h-4 text-[#071426]" /> Education
          </span>
          <span className="font-bold text-[#050E1A] truncate max-w-[180px]" title={candidate.member.education}>
            {candidate.member.education}
          </span>
        </div>
      </div>

      {/* Verified Status Note */}
      <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Verified 31-Day Cohort Candidate</span>
      </div>
    </div>
  );
};

export default ProfileCard;
