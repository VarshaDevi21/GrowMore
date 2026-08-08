import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const WhyDifferentSection: React.FC = () => {
  const comparisons = [
    {
      feature: 'Question Relevance',
      traditional: 'Generic algorithm questions unrelated to your project or learning progress.',
      agent: 'Directly tied to your actual 31-day curriculum, tools, code commits, and project milestones.',
      highlight: true,
    },
    {
      feature: 'Difficulty Dynamics',
      traditional: 'Static questions that don’t adapt whether you answer brilliantly or fail completely.',
      agent: 'Real-time adaptive difficulty. Deepens on strong mastery; probes foundation on hesitation.',
      highlight: true,
    },
    {
      feature: 'Technical Depth Probing',
      traditional: 'Keyword matching with no follow-up on architecture trade-offs or decisions.',
      agent: 'Actively probes specific technical terms you use (e.g., embeddings, MCP, HNSW, SQLite routers).',
      highlight: true,
    },
    {
      feature: 'Feedback & Actionability',
      traditional: 'Generic pass/fail percentage scores with no concrete next steps.',
      agent: 'Granular evaluation scorecard linking skill gaps directly to specific curriculum days to review.',
      highlight: true,
    },
  ];

  return (
    <section id="comparison" className="py-24 relative overflow-hidden bg-[#0B1F3A]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Product Differentiation"
          badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
          title="Traditional Interview Apps vs"
          highlightedTitle="AI Interview Agent"
          subtitle="Why generic LeetCode question banks fail to measure applied AI engineering proficiency."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Traditional Apps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="h-full rounded-3xl bg-[#071426]/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#8B93A1]">Legacy Paradigm</span>
                    <h3 className="text-xl font-bold text-[#8B93A1] font-['Outfit']">
                      Traditional Interview Apps
                    </h3>
                  </div>
                  <Badge variant="muted" size="sm">
                    Static
                  </Badge>
                </div>

                <div className="space-y-6">
                  {comparisons.map((item) => (
                    <div key={item.feature} className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#8B93A1]">
                        <X className="w-4 h-4 text-[#B54747] shrink-0" />
                        <span>{item.feature}</span>
                      </div>
                      <p className="text-xs text-[#8B93A1] pl-6 leading-relaxed">
                        {item.traditional}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-[#8B93A1] text-center font-mono">
                Static question pools · No context retention
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Interview Agent (Dominant Gold/Navy) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative h-full rounded-3xl bg-[#0B1F3A] border-2 border-[#C9A96E]/50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-[#071426]">
              {/* Highlight badge on top */}
              <div className="absolute -top-3.5 right-6">
                <span className="bg-gradient-to-r from-[#C9A96E] to-[#D8BA82] text-[#071426] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md font-mono">
                  State of the Art
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C9A96E]/20">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#C9A96E] font-semibold">
                      Next-Gen Evaluation
                    </span>
                    <h3 className="text-2xl font-bold text-[#FFFDF7] font-['Outfit']">
                      AI Interview Agent
                    </h3>
                  </div>
                  <Badge variant="gold" size="sm" pulse>
                    Adaptive
                  </Badge>
                </div>

                <div className="space-y-6">
                  {comparisons.map((item) => (
                    <div
                      key={item.feature}
                      className="p-3.5 rounded-2xl bg-[#16345C]/40 border border-[#C9A96E]/20 space-y-1.5 hover:border-[#C9A96E]/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#FFFDF7]">
                          <Check className="w-4 h-4 text-[#68D391] shrink-0" />
                          <span>{item.feature}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#C9A96E] uppercase bg-[#071426] px-2 py-0.5 rounded border border-white/5">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-[#C8CDD5] pl-6 leading-relaxed">
                        {item.agent}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#C9A96E]/20 flex items-center justify-between text-xs text-[#C9A96E]">
                <span className="font-semibold">Context-Aware Adaptive Engine</span>
                <span className="font-mono text-[11px] text-[#68D391]">
                  100% Curriculum Linked
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
