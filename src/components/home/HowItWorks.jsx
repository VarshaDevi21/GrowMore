import { motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Your Learning Journey",
    description:
      "The system understands the candidate's actual learning progress.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Curriculum Context",
    description:
      "Interview questions are grounded in relevant curriculum topics.",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Adaptive Interview",
    description:
      "Every answer can influence the direction and difficulty of the next question.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Personalized Feedback",
    description:
      "The interview ends with strengths, gaps, and actionable next steps.",
  },
];

function HowItWorksPreview() {
  return (
    <section
      id="how-it-works"
      className="bg-[#0B1F3A]/30 px-4 py-24 sm:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
            How it works
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">
            From learning journey to technical interview.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="text-center"
              >
                <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[#C9A96E]/30 bg-[#071426]">
                  <Icon className="h-6 w-6 text-[#C9A96E]" />
                </div>

                <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#C9A96E]">
                  {step.number}
                </p>

                <h3 className="mt-3 font-semibold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#8B93A1]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksPreview;