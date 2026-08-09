import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bot,
  User,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllCandidates, setSelectedCandidateId } from '../data/candidate';

export const Login = () => {
  const navigate = useNavigate();
  const candidates = getAllCandidates();

  const [selectedId, setSelectedId] = useState('CAND-001');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.member.name.toLowerCase().includes(term) ||
      c.member.id.toLowerCase().includes(term) ||
      c.member.jobRole.toLowerCase().includes(term)
    );
  });

  const selectedCandidate = candidates.find((c) => c.member.id === selectedId) || candidates[0];

  const handleSelectCandidate = (id) => {
    setSelectedId(id);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Store in localStorage as required
    setSelectedCandidateId(selectedId);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Candidate Authentication & Selection
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#050E1A] font-['Outfit']">
            Select Cohort Candidate
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#1E293B] max-w-xl mx-auto font-medium">
            Choose from all 20 verified cohort members in candidates.json to enter the personalized candidate platform.
          </p>
        </div>

        {/* 20 Candidates Selector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: 20 Candidates Grid & Search (8 cols) */}
          <div className="lg:col-span-8 card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6">
            {/* Search bar + count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#071426] flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-[#FFFDF7]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#050E1A] font-['Outfit']">
                    Cohort Candidates
                  </h2>
                  <p className="text-[11px] text-[#475569] font-medium">Source: src/data/candidates.json</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#FFFFFF] border border-[#E2D9C8] px-3 py-1 rounded-lg text-[#050E1A]">
                  Showing {filteredCandidates.length} of {candidates.length}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates by name, job role, or ID (e.g. CAND-015, Architect, Emily)..."
                className="w-full rounded-2xl bg-[#FAF7F0] border-2 border-[#E2D9C8] px-4 py-3 pl-11 text-xs sm:text-sm text-[#050E1A] font-medium focus:outline-none focus:border-[#071426] transition-colors"
              />
              <Search className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
            </div>

            {/* Candidates 2-Column Responsive Grid with Scroll */}
            <div className="max-h-[520px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredCandidates.map((c) => {
                const isSelected = selectedId === c.member.id;
                return (
                  <button
                    key={c.member.id}
                    type="button"
                    onClick={() => handleSelectCandidate(c.member.id)}
                    className={`p-4 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer border-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#071426] text-[#FFFDF7] border-[#071426] shadow-lg shadow-[#071426]/15 scale-[1.01]'
                        : 'bg-[#FAF7F0] border-[#E2D9C8] hover:border-[#071426]/50 hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <div>
                      {/* Top Bar: ID + Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#C9A96E] text-[#071426]'
                              : 'bg-[#FFFFFF] text-[#050E1A] border border-[#E2D9C8]'
                          }`}
                        >
                          {c.member.id}
                        </span>

                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#FFFFFF]/15 text-[#C9A96E]'
                              : 'bg-[#2E7D32]/10 text-[#2E7D32]'
                          }`}
                        >
                          {c.member.status}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <h3
                        className={`text-sm font-extrabold font-['Outfit'] line-clamp-1 ${
                          isSelected ? 'text-[#FFFDF7]' : 'text-[#050E1A]'
                        }`}
                      >
                        {c.member.name}
                      </h3>

                      <span
                        className={`text-xs font-semibold block line-clamp-1 mt-0.5 ${
                          isSelected ? 'text-[#C8CDD5]' : 'text-[#334155]'
                        }`}
                      >
                        {c.member.jobRole}
                      </span>
                    </div>

                    {/* Metadata Footer */}
                    <div
                      className={`mt-3 pt-2.5 border-t text-[11px] font-medium flex items-center justify-between ${
                        isSelected ? 'border-white/10 text-[#C8CDD5]' : 'border-[#EFE8DC] text-[#475569]'
                      }`}
                    >
                      <span>{c.member.yearsExperience} YOE</span>
                      <span>{c.signals.missionsCompleted} Missions</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]" />
                      ) : (
                        <span className="text-[10px] font-bold text-[#071426]">Select →</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Candidate Details & Login Action (4 cols) */}
          <div className="lg:col-span-4 card-surface rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-[#E2D9C8] space-y-6 sticky top-28">
            <div className="text-center pb-4 border-b border-[#EFE8DC]">
              <div className="w-12 h-12 rounded-2xl bg-[#071426] flex items-center justify-center mx-auto mb-3 shadow-md">
                <Bot className="w-6 h-6 text-[#FFFDF7]" />
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1 rounded-full font-extrabold inline-block mb-1">
                Candidate Selected
              </span>
              <h2 className="text-xl font-extrabold text-[#050E1A] font-['Outfit']">
                {selectedCandidate.member.name}
              </h2>
              <p className="text-xs font-mono text-[#475569]">{selectedCandidate.member.id}</p>
            </div>

            {/* Candidate Spec Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[#475569] flex items-center gap-1.5 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-[#071426]" /> Job Role
                </span>
                <span className="font-bold text-[#050E1A]">{selectedCandidate.member.jobRole}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[#475569] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#071426]" /> Experience
                </span>
                <span className="font-bold text-[#050E1A]">
                  {selectedCandidate.member.yearsExperience} Years
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[#475569] flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-[#071426]" /> Education
                </span>
                <span className="font-bold text-[#050E1A] truncate max-w-[170px]" title={selectedCandidate.member.education}>
                  {selectedCandidate.member.education}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[#475569] flex items-center gap-1.5 font-medium">
                  <CheckSquare className="w-3.5 h-3.5 text-[#2E7D32]" /> Missions Completed
                </span>
                <span className="font-mono font-bold text-[#2E7D32]">
                  {selectedCandidate.signals.missionsCompleted} / 31
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[#475569] flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Commit Days
                </span>
                <span className="font-mono font-bold text-[#050E1A]">
                  {selectedCandidate.signals.commitDays} Days
                </span>
              </div>
            </div>

            {/* Login / Continue CTA */}
            <form onSubmit={handleContinue} className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-xl shadow-[#071426]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Continue as {selectedCandidate.member.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-[#475569]">
              <Link to="/" className="text-[#050E1A] hover:underline font-bold">
                ← Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
