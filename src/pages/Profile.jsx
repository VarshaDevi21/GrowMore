import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import CompletionRate from '../components/CompletionRate';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';

export const Profile = () => {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Candidate Account
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#050E1A] font-['Outfit']">
            {candidate.member.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-mono mt-1">
            Candidate ID: {candidate.member.id} · {candidate.member.jobRole}
          </p>
        </div>

        {/* 2-Column Profile details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileCard candidate={candidate} />
          <CompletionRate candidate={candidate} />
        </div>

        {/* Action card */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] text-center space-y-4">
          <h2 className="text-xl font-bold text-[#050E1A] font-['Outfit']">
            Ready for your 31-day evaluation?
          </h2>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto">
            Proceed to your adaptive interview or review your complete 31-day curriculum journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/interview-setup"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
            >
              <span>Setup Interview</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>

            <Link
              to="/roadmap"
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#FFFFFF] border border-[#E2D9C8] text-[#050E1A] hover:bg-[#FAF7F0] flex items-center gap-2"
            >
              <span>View 31-Day Roadmap</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
