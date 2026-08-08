import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Network,
  Gauge,
  ScanSearch,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive Technical Interview",
    description:
      "Questions evolve based on the candidate's previous answers and demonstrated understanding.",
  },
  {
    icon: BookOpen,
    title: "Curriculum-Aware",
    description:
      "The interview is grounded in the candidate's actual learning journey.",
  },
  {
    icon: Network,
    title: "Technical Deep Dives",
    description:
      "Technical terms mentioned by the candidate can become the next line of questioning.",
  },
  {
    icon: Gauge,
    title: "Dynamic Difficulty",
    description:
      "Strong answers lead to harder questions while weaker answers trigger deeper foundational probing.",
  },
  {
    icon: ScanSearch,
    title: "Personalized Evaluation",
    description:
      "Analyze technical accuracy, completeness, reasoning, clarity, and efficiency.",
  },
  {
    icon: TrendingUp,
    title: "Actionable Feedback",
    description:
      "Discover strengths, skill gaps, and what to study next.",
  },
];

function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
          Built differently
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          More than an interview.
          <span className="block text-[#AEB6C2]">
            A technical growth system.
          </span>
        </h2>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-white/10 bg-[#0B1F3A]/60 p-6 transition hover:border-[#C9A96E]/30 hover:bg-[#0B1F3A]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A96E]/20 bg-[#C9A96E]/10">
                  <Icon className="h-5 w-5 text-[#C9A96E]" />
                </div>

                <h3 className="mt-7 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#8B93A1]">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;