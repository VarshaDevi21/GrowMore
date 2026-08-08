import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const InterviewExperience = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Live Evaluation Environment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#050E1A] font-['Outfit']">
            Interview Experience
          </h1>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto font-medium mt-1">
            Understanding the real-time AI interview environment and adaptive feedback loops.
          </p>
        </div>

        <div className="card-surface rounded-3xl p-8 sm:p-10 shadow-sm border-2 border-[#E2D9C8] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EFE8DC]">
            <div className="w-10 h-10 rounded-xl bg-[#071426] flex items-center justify-center text-[#FFFDF7]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#050E1A] font-['Outfit']">
                20-Minute Focus Sandbox
              </h2>
              <p className="text-xs text-[#475569]">Clean distraction-free evaluation interface</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed font-medium">
            When you launch an interview, the application enters full-screen sandbox mode. The AI interviewer analyzes your responses in real time, adapting question difficulty between Foundational, Applied, and Principal Architect tiers.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              to="/interview-setup"
              className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
            >
              <span>Setup Interview Now</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewExperience;
