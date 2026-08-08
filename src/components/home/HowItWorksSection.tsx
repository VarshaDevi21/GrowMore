import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Cpu,
  BrainCircuit,
  FileCheck2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Your Learning Journey',
      subtitle: 'Curriculum & Mission Sync',
      description:
        'The agent reads your 31-day journey, including completed modules, tool setups (FastAPI, ChromaDB, LangChain, MCP), and code commits.',
      icon: <Layers className="w-6 h-6 text-[#C9A96E]" />,
      tags: ['31 Days', 'Real Missions', 'Tool Stack'],
    },
    {
      number: '02',
      title: 'AI Builds Your Interview',
      subtitle: 'Dynamic Question Graph',
      description:
        'A tailored interview session is generated based strictly on the topics you have covered. No random LeetCode puzzles—only applied system design & engineering.',
      icon: <Cpu className="w-6 h-6 text-[#68D391]" />,
      tags: ['No Fake Questions', 'Curriculum-Aware', '10 Target Probes'],
    },
    {
      number: '03',
      title: 'Adaptive Technical Interview',
      subtitle: 'Real-Time Concept Probing',
      description:
        'As you answer, the AI analyzes terminology, architectural choices, and edge-case handling, dynamically scaling difficulty up or foundational depth down.',
      icon: <BrainCircuit className="w-6 h-6 text-[#F6AD55]" />,
      tags: ['Dynamic Difficulty', 'Technical Depth', 'Live Dialogue'],
    },
    {
      number: '04',
      title: 'Personalized Feedback',
      subtitle: 'Actionable Growth Blueprint',
      description:
        'Receive an exhaustive evaluation scorecard detailing conceptual strengths, skill gaps, and precise curriculum days to revisit for full readiness.',
      icon: <FileCheck2 className="w-6 h-6 text-[#C9A96E]" />,
      tags: ['Accuracy Score', 'Skill Gaps', 'Curriculum Links'],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#0B1F3A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Step-by-Step Architecture"
          badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
          title="How It"
          highlightedTitle="Actually Works"
          subtitle="From your 31-day curriculum commits to an adaptive AI interview session and structured growth diagnostics."
        />

        {/* Visual Connecting Step Grid */}
        <div className="relative">
          {/* Connecting Line for Large screens */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#16345C] via-[#C9A96E]/40 to-[#16345C] -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <Card
                  variant="glass"
                  className="h-full flex flex-col justify-between p-6 hover:border-[#C9A96E]/50 group"
                >
                  <div>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16345C] to-[#071426] border border-[#C9A96E]/30 flex items-center justify-center shadow-lg shadow-[#071426] group-hover:border-[#C9A96E] group-hover:scale-105 transition-all">
                        {step.icon}
                      </div>
                      <span className="text-2xl font-black font-mono text-[#C9A96E]/70 group-hover:text-[#C9A96E] transition-colors">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Title */}
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A96E] block mb-1">
                      {step.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-[#FFFDF7] mb-3 font-['Outfit'] group-hover:text-[#F7F1E3] transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#C8CDD5] leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-[#071426] text-[#8B93A1] px-2 py-0.5 rounded border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
