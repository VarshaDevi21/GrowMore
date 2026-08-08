import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Brain,
  Code2,
  Cpu,
  CheckCircle2,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const HeroSection: React.FC = () => {
  const journeyFlow = [
    { label: '31 Days', sub: 'Curriculum', icon: <Layers className="w-4 h-4 text-[#C9A96E]" /> },
    { label: 'Learning Journey', sub: 'Completed Missions', icon: <Code2 className="w-4 h-4 text-[#68D391]" /> },
    { label: 'AI Interview', sub: '10 Adaptive Probes', icon: <Bot className="w-4 h-4 text-[#C9A96E]" /> },
    { label: 'Technical Evaluation', sub: 'Accuracy & Logic', icon: <Cpu className="w-4 h-4 text-[#F6AD55]" /> },
    { label: 'Personalized Growth', sub: 'Skill Gaps & Next Steps', icon: <TrendingUp className="w-4 h-4 text-[#68D391]" /> },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-gradient bg-grid-pattern"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#16345C]/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#C9A96E]/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Top pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1F3A] border border-[#C9A96E]/30 shadow-lg shadow-[#071426]/50">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E] animate-pulse" />
                <span className="text-xs font-semibold text-[#FFFDF7] font-mono">
                  31-Day AI Cohort · Adaptive Evaluation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D44]"></span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#FFFDF7] leading-[1.1]">
                Your Learning Journey.{' '}
                <span className="block mt-2 bg-gradient-to-r from-[#FFFDF7] via-[#F7F1E3] to-[#C9A96E] bg-clip-text text-transparent">
                  Your Technical Interview.
                </span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#C8CDD5] max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              An adaptive AI interviewer that understands what you learned, challenges your technical
              depth, and gives you personalized feedback.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                variant="gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleScrollTo('#interview-preview')}
                className="w-full sm:w-auto shadow-xl shadow-[#C9A96E]/20"
              >
                Start Interview
              </Button>

              <Button
                variant="primary"
                size="lg"
                icon={<Layers className="w-4 h-4 text-[#C9A96E]" />}
                iconPosition="left"
                onClick={() => handleScrollTo('#roadmap')}
                className="w-full sm:w-auto"
              >
                Explore Roadmap
              </Button>
            </motion.div>

            {/* Live indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#8B93A1]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3A7D44]" />
                <span>Zero Fake Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3A7D44]" />
                <span>Curriculum-Tied Probes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3A7D44]" />
                <span>Real-Time Code & Concept Analysis</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium AI Interviewer Visual & Concept Journey */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Outer glowing halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#C9A96E]/30 via-[#16345C] to-[#C9A96E]/20 blur-xl opacity-60 animate-pulse-subtle" />

              {/* Main Agent Visual Container */}
              <div className="relative rounded-3xl bg-[#0B1F3A]/90 backdrop-blur-2xl border border-[#C9A96E]/30 p-5 sm:p-6 shadow-2xl shadow-[#071426]">
                {/* Header of AI Agent Visual */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16345C] to-[#071426] border border-[#C9A96E]/40">
                      <Bot className="w-5 h-5 text-[#C9A96E]" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#3A7D44] border-2 border-[#0B1F3A] rounded-full"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#FFFDF7] font-['Outfit']">
                          AI Interview Agent
                        </span>
                        <Badge variant="gold" size="sm">
                          Active
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#8B93A1]">Adaptive Logic Engine v2.4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071426] border border-white/10 text-[11px] font-mono text-[#C8CDD5]">
                    <Activity className="w-3.5 h-3.5 text-[#C9A96E] animate-pulse" />
                    <span>Live Session</span>
                  </div>
                </div>

                {/* 5-Step Concept Diagram Flow */}
                <div className="py-4 space-y-2.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A96E] font-semibold flex items-center justify-between">
                    <span>Adaptive Evaluation Pipeline</span>
                    <span className="text-[#8B93A1]">5 Stages</span>
                  </div>

                  <div className="space-y-2">
                    {journeyFlow.map((step, idx) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          idx === 2
                            ? 'bg-[#16345C]/70 border-[#C9A96E]/50 shadow-md shadow-[#C9A96E]/10'
                            : 'bg-[#071426]/60 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#0B1F3A] flex items-center justify-center border border-white/10 shrink-0">
                            {step.icon}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[#FFFDF7] block">
                              {step.label}
                            </span>
                            <span className="text-[10px] text-[#8B93A1]">{step.sub}</span>
                          </div>
                        </div>

                        {idx < journeyFlow.length - 1 ? (
                          <span className="text-[10px] font-mono text-[#C9A96E]/60 bg-[#0B1F3A] px-1.5 py-0.5 rounded border border-white/5">
                            ↓ Next
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#68D391] bg-[#3A7D44]/20 px-1.5 py-0.5 rounded border border-[#3A7D44]/40">
                            Report
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating micro stats inside card */}
                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-[#071426]/70 border border-white/5 flex items-center gap-2.5">
                    <Brain className="w-4 h-4 text-[#C9A96E] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#8B93A1] block">Depth Probing</span>
                      <span className="text-xs font-bold text-[#FFFDF7]">Context-Aware</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#071426]/70 border border-white/5 flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-[#68D391] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#8B93A1] block">Difficulty Scale</span>
                      <span className="text-xs font-bold text-[#68D391]">Dynamic Adaptive</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
