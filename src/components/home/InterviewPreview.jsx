import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock3,
  Mic,
  Send,
  Sparkles,
} from "lucide-react";

function InterviewPreview() {
  return (
    <section
      id="interview"
      className="bg-[#0B1F3A]/30 px-4 py-24 sm:px-6 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
            The interview experience
          </p>

          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Experience an interview
            <span className="block text-[#AEB6C2]">
              that actually listens.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#8B93A1]">
            Instead of moving through a fixed question list, the interviewer
            follows your reasoning, probes technical concepts, and adapts to
            your demonstrated depth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-[28px] border border-white/10 bg-[#071426] p-4 shadow-2xl sm:p-6"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0B1F3A]/70 p-5 sm:p-6">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A96E]/10">
                  <BrainCircuit className="h-5 w-5 text-[#C9A96E]" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Interviewer
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-[#8B93A1]">
                      Listening
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8B93A1]">
                <Clock3 className="h-3.5 w-3.5" />
                14:32
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8B93A1]">
                  Question 04 / 10
                </span>

                <span className="rounded-full bg-[#C9A96E]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D8BC83]">
                  Medium
                </span>
              </div>

              <p className="mt-4 text-lg font-medium leading-8">
                Tell me how you would approach building a retrieval pipeline
                for a production AI application.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#C9A96E]/20 bg-[#C9A96E]/5 p-4">
              <div className="flex items-center gap-2 text-xs text-[#D8BC83]">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive follow-up enabled
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#071426] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-[#C8CDD5]">
                  Your Answer
                </span>

                <Mic className="h-4 w-4 text-[#8B93A1]" />
              </div>

              <p className="min-h-20 text-sm leading-6 text-[#6F7887]">
                Explain your approach here...
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#F7F1E3] px-4 py-2.5 text-xs font-bold text-[#071426] transition hover:bg-[#C9A96E]">
                Submit Answer
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default InterviewPreview;