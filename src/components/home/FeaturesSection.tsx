import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  BookMarked,
  SearchCode,
  Gauge,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'adaptive',
      title: 'Adaptive Technical Interview',
      description:
        "Questions dynamically adapt based on the candidate's previous answers. If you demonstrate mastery, the interview pushes further; if you stumble, it isolates the underlying premise.",
      icon: <BrainCircuit className="w-6 h-6 text-[#C9A96E]" />,
      badge: 'Core Intelligence',
      highlight: 'Context-driven adaptation',
    },
    {
      id: 'curriculum',
      title: 'Curriculum-Aware',
      description:
        "The interview is mapped directly to the candidate's actual 31-day learning journey. It knows which days you completed, which tools you configured, and which capstones you built.",
      icon: <BookMarked className="w-6 h-6 text-[#68D391]" />,
      badge: 'Day 1 → Day 31',
      highlight: 'Zero generic templates',
    },
    {
      id: 'deep-dives',
      title: 'Technical Deep Dives',
      description:
        'The interviewer actively probes concepts mentioned in your candidate response. Mention embeddings, chunk size, or MCP protocols, and expect follow-up scrutiny on trade-offs.',
      icon: <SearchCode className="w-6 h-6 text-[#F6AD55]" />,
      badge: 'Terminology Probing',
      highlight: 'Keyword & logic inspection',
    },
    {
      id: 'difficulty',
      title: 'Dynamic Difficulty',
      description:
        'Strong technical answers unlock advanced edge cases and architecture questions. Weak or incomplete answers lead to foundational diagnostic questions to evaluate your baseline.',
      icon: <Gauge className="w-6 h-6 text-[#C9A96E]" />,
      badge: 'Real-Time Scaling',
      highlight: 'Easy → Medium → Hard → Principal',
    },
    {
      id: 'evaluation',
      title: 'Personalized Evaluation',
      description:
        'Multidimensional breakdown analyzing technical accuracy, architectural completeness, deductive logic, conceptual clarity, and computational efficiency.',
      icon: <Sparkles className="w-6 h-6 text-[#68D391]" />,
      badge: '5 Evaluation Axes',
      highlight: 'Deterministic scoring',
    },
    {
      id: 'feedback',
      title: 'Actionable Feedback',
      description:
        'Receive a concrete report identifying proven strengths, critical skill gaps, curriculum days to review, and specific learning objectives to revisit before live hiring interviews.',
      icon: <Award className="w-6 h-6 text-[#F6AD55]" />,
      badge: 'Targeted Growth',
      highlight: 'Curriculum-linked next steps',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#071426]">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#16345C]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C9A96E]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Product Capabilities"
          badgeIcon={<Layers className="w-3.5 h-3.5" />}
          title="Engineered for"
          highlightedTitle="Precision Evaluation"
          subtitle="Moving beyond static question banks. An AI interviewer built to test genuine technical comprehension through adaptive dialogue."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <Card
                variant="glass"
                className="h-full flex flex-col justify-between p-6 sm:p-7 group hover:border-[#C9A96E]/50"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16345C] to-[#0B1F3A] border border-[#C9A96E]/30 flex items-center justify-center group-hover:scale-105 group-hover:border-[#C9A96E] transition-all duration-300 shadow-md shadow-[#071426]">
                      {feature.icon}
                    </div>
                    <Badge variant="gold" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#FFFDF7] group-hover:text-[#F7F1E3] transition-colors mb-2.5 font-['Outfit']">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#C8CDD5] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Highlight Tag */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#C9A96E] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]"></span>
                    {feature.highlight}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8B93A1] group-hover:text-[#FFFDF7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
