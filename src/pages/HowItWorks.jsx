import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  Bot,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Connect 31-Day Journey',
      subtitle: 'Curriculum & Telemetry Sync',
      description:
        'The platform connects with the candidate’s actual 31-day curriculum history. It tracks which days were completed, which tools were configured (Python, ChromaDB, FastAPI, LangChain, MCP), and which missions were passed.',
      icon: <Layers className="w-5 h-5 text-[#C9A96E]" />,
    },
    {
      number: '02',
      title: 'AI Builds Technical Plan',
      subtitle: 'Targeted Question Blueprint',
      description:
        'The agent creates an adaptive 10-question evaluation plan based on the topics and tools the candidate actually encountered. It avoids unrelated questions and focuses on real application depth.',
      icon: <Cpu className="w-5 h-5 text-[#071426]" />,
    },
    {
      number: '03',
      title: 'Live 20-Minute Interview',
      subtitle: 'Real-Time Depth Probing',
      description:
        'During the live session, the AI interviewer dynamically probes technical reasoning. Strong architectural responses increase question complexity, while hesitation routes to foundational checks.',
      icon: <Bot className="w-5 h-5 text-[#C9A96E]" />,
    },
    {
      number: '04',
      title: 'Diagnostic Report',
      subtitle: 'Curriculum-Linked Feedback',
      description:
        'After completing 10 questions, the candidate receives scores across 5 core evaluation dimensions, demonstrated strengths, identified skill gaps, and specific curriculum days to review.',
      icon: <Award className="w-5 h-5 text-[#071426]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Evaluation Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#050E1A] font-['Outfit']">
            How It Works
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#1E293B] max-w-2xl mx-auto leading-relaxed font-medium">
            A deterministic, curriculum-aware interview agent that bridges learning milestones with real-time adaptive technical evaluation.
          </p>
        </div>

        {/* 4 Steps In Horizontal Cards Container */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-[#E2D9C8] bg-[#FAF7F0] mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="rounded-2xl bg-[#FFFFFF] border border-[#E2D9C8] p-5 sm:p-6 flex flex-col justify-between hover:border-[#071426] transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-center shadow-sm group-hover:bg-[#071426] group-hover:text-[#FFFDF7] transition-all">
                      {step.icon}
                    </div>
                    <span className="text-xl font-black font-mono text-[#050E1A] bg-[#FAF7F0] px-2.5 py-1 rounded-lg border border-[#E2D9C8]">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E] block mb-1 font-extrabold">
                    {step.subtitle}
                  </span>
                  <h2 className="text-base font-bold text-[#050E1A] mb-2 font-['Outfit']">
                    {step.title}
                  </h2>
                  <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFE8DC] flex items-center justify-between text-[11px] font-mono text-[#475569]">
                  <span className="font-bold">Stage {index + 1} of 4</span>
                  {index < 3 ? (
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E] hidden lg:block" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Login */}
        <div className="card-surface rounded-3xl p-8 sm:p-10 text-center space-y-4 border border-[#E2D9C8]">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050E1A] font-['Outfit']">
            Ready to Begin Your Evaluation?
          </h2>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-xl mx-auto font-medium">
            Select your candidate profile to view your learning roadmap and launch your adaptive interview.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-lg flex items-center gap-2"
            >
              <span>Get Started with Candidate Selection</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
