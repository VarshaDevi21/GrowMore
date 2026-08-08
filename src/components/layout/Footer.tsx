import React from 'react';
import { Bot, Sparkles, Terminal, Shield, ArrowUp, Globe, Code2, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#16345C] bg-[#071426] pt-16 pb-12 overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#C9A96E]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16345C] to-[#0B1F3A] border border-[#C9A96E]/40 shadow-lg shadow-[#C9A96E]/10">
                <Bot className="w-5 h-5 text-[#C9A96E]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#FFFDF7] font-['Outfit']">
                    GrowMore
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#C9A96E]/20 text-[#C9A96E] px-1.5 py-0.5 rounded border border-[#C9A96E]/30">
                    Agent
                  </span>
                </div>
                <span className="text-xs text-[#8B93A1]">Adaptive AI Technical Interviewer</span>
              </div>
            </div>

            <p className="text-sm text-[#8B93A1] max-w-sm leading-relaxed">
              An intelligent technical interview platform that evaluates candidates based on their
              actual 31-day curriculum journey, probes technical depth, and generates actionable growth reports.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#hero"
                className="w-9 h-9 rounded-lg bg-[#0B1F3A] border border-white/10 flex items-center justify-center text-[#8B93A1] hover:text-[#FFFDF7] hover:border-[#C9A96E]/50 transition-colors"
                aria-label="Repository & Code"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="#hero"
                className="w-9 h-9 rounded-lg bg-[#0B1F3A] border border-white/10 flex items-center justify-center text-[#8B93A1] hover:text-[#FFFDF7] hover:border-[#C9A96E]/50 transition-colors"
                aria-label="Community Network"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#hero"
                className="w-9 h-9 rounded-lg bg-[#0B1F3A] border border-white/10 flex items-center justify-center text-[#8B93A1] hover:text-[#FFFDF7] hover:border-[#C9A96E]/50 transition-colors"
                aria-label="Share Evaluation"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] font-semibold mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  31-Day Roadmap
                </a>
              </li>
              <li>
                <a href="#interview-preview" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Live Interview Simulator
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] font-semibold mb-4">
              AI Evaluation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#8B93A1]">
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>10 Adaptive Questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Concept Deep Dives</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#3A7D44]" />
                <span>Curriculum-Awareness</span>
              </li>
              <li>
                <a href="#comparison" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Why We Are Different
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & System */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] font-semibold mb-4">
              Candidate & Privacy
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#candidate-profile" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Candidate Profile
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-[#8B93A1] hover:text-[#FFFDF7] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#3A7D44] bg-[#3A7D44]/15 px-2 py-0.5 rounded border border-[#3A7D44]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D44] animate-pulse"></span>
                  System Online
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B93A1]">
          <p>© {new Date().getFullYear()} GrowMore AI Interview Agent. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Technical Excellence</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#C8CDD5] hover:text-[#C9A96E] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
