import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:pt-40"
    >
      {/* Background glow */}
      <div className="absolute left-1/2 top-20 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#16345C]/30 blur-[140px]" />

      <div className="absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-[#C9A96E]/10 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/20 bg-[#C9A96E]/10 px-4 py-2 text-xs font-medium text-[#D8BC83]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Technical Interview
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
            Your Learning Journey.
            <span className="block text-[#C9A96E]">
              Your Technical Interview.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-[#AEB6C2] sm:text-lg">
            An adaptive AI interviewer that understands what you learned,
            challenges your technical depth, and gives you personalized
            feedback.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#interview"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F7F1E3] px-6 py-3.5 text-sm font-bold text-[#071426] transition hover:bg-[#C9A96E]"
            >
              Start Interview
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>

            <a
              href="#roadmap"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold transition hover:border-[#C9A96E]/40"
            >
              Explore Roadmap
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#8B93A1]">
            {[
              "31 Learning Days",
              "10 Questions",
              "20 Min Maximum",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#C9A96E]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right AI Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -inset-10 rounded-full bg-[#16345C]/30 blur-3xl" />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative rounded-[28px] border border-white/10 bg-[#0B1F3A]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A96E]/10">
                  <BrainCircuit className="h-5 w-5 text-[#C9A96E]" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Interviewer
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-[#8B93A1]">
                      Listening
                    </span>
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-[#C9A96E]/20 bg-[#C9A96E]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#D8BC83]">
                Medium
              </span>
            </div>

            {/* Question */}
            <div className="rounded-2xl border border-white/10 bg-[#071426]/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-[#8B93A1]">
                  Question 04 / 10
                </span>

                <span className="font-mono text-xs text-[#C8CDD5]">
                  14:32
                </span>
              </div>

              <p className="text-lg font-medium leading-8 sm:text-xl">
                Tell me how you would approach building a retrieval pipeline
                for a production AI application.
              </p>
            </div>

            {/* Adaptive */}
            <div className="mt-4 rounded-2xl border border-[#C9A96E]/20 bg-[#C9A96E]/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-[#D8BC83]">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive follow-up
              </div>

              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.2 }}
                  className="h-full rounded-full bg-[#C9A96E]"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <div className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.03]" />
              <div className="w-20 rounded-xl bg-[#F7F1E3]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;