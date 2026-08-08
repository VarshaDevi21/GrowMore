import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const FinalCtaSection: React.FC = () => {
  const scrollToInterview = () => {
    const el = document.querySelector('#interview-preview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#071426]">
      {/* Glow rings and background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A96E]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#16345C] to-[#0B1F3A] border-2 border-[#C9A96E]/40 p-8 sm:p-12 md:p-16 text-center shadow-2xl shadow-[#071426] overflow-hidden"
        >
          {/* Subtle gold accent line on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="gold" pulse size="md">
              <Sparkles className="w-3.5 h-3.5" /> 31-Day Cohort Final Assessment
            </Badge>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight leading-[1.15] max-w-3xl mx-auto font-['Outfit']">
            Ready to test what you{' '}
            <span className="bg-gradient-to-r from-[#FFFDF7] via-[#F7F1E3] to-[#C9A96E] bg-clip-text text-transparent">
              actually learned?
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-base sm:text-lg text-[#C8CDD5] max-w-2xl mx-auto leading-relaxed">
            Step into an adaptive technical interview built around your own learning journey.
          </p>

          {/* Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={scrollToInterview}
              className="w-full sm:w-auto shadow-2xl shadow-[#C9A96E]/30 text-base"
            >
              Start Your Interview
            </Button>
          </div>

          {/* Micro assurances */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8B93A1]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3A7D44]" />
              <span>10 Adaptive Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#3A7D44]" />
              <span>Real-Time Diagnostic Report</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Zero Fake Questions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
