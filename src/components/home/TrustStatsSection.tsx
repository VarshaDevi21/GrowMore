import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, HelpCircle, Clock, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';

export const TrustStatsSection: React.FC = () => {
  const stats = [
    {
      value: '31',
      label: 'Learning Days',
      description: 'Structured end-to-end curriculum from Python setup to multi-agent deployment.',
      icon: <Calendar className="w-5 h-5 text-[#C9A96E]" />,
      badge: 'Full Cohort',
    },
    {
      value: '10',
      label: 'Interview Questions',
      description: 'Targeted technical probes with real-time dynamic difficulty adjustments.',
      icon: <HelpCircle className="w-5 h-5 text-[#68D391]" />,
      badge: 'Per Session',
    },
    {
      value: '4+',
      label: 'Curriculum Days Covered',
      description: 'Rigorous cross-module technical concepts verified in every single interview.',
      icon: <BookOpen className="w-5 h-5 text-[#C9A96E]" />,
      badge: 'Multi-Topic',
    },
    {
      value: '20 min',
      label: 'Maximum Interview',
      description: 'Focused, high-signal technical evaluation session with zero filler questions.',
      icon: <Clock className="w-5 h-5 text-[#F6AD55]" />,
      badge: 'High Signal',
    },
  ];

  return (
    <section className="py-14 relative z-10 border-y border-[#16345C]/60 bg-[#071426]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A] border border-[#C9A96E]/20 text-[11px] font-mono text-[#C9A96E] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Product Architecture Specifications
          </div>
          <p className="text-xs text-[#8B93A1]">
            Deterministic evaluation parameters built for concrete technical mastery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="glass"
                className="h-full flex flex-col justify-between p-5 sm:p-6 hover:border-[#C9A96E]/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#16345C]/50 border border-white/10 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#0B1F3A] text-[#C9A96E] px-2 py-0.5 rounded border border-[#C9A96E]/30">
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-[#FFFDF7] font-['Outfit'] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-[#FFFDF7] mt-1 mb-2">
                    {stat.label}
                  </div>
                  <p className="text-xs text-[#8B93A1] leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#68D391]">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Benchmark</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
