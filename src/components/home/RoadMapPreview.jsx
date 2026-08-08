import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

function RoadmapPreview() {
  return (
    <section id="roadmap" className="px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
              Learning journey
            </p>

            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
              31 days of learning.
              <span className="block text-[#AEB6C2]">
                One intelligent interview.
              </span>
            </h2>
          </div>

          <a
            href="#roadmap"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#D8BC83]"
          >
            Explore roadmap
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-14 overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1F3A]/50 p-5 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                31-Day Learning Journey
              </p>

              <p className="mt-1 text-xs text-[#8B93A1]">
                Your learning progress at a glance
              </p>
            </div>

            <span className="rounded-full border border-[#C9A96E]/20 bg-[#C9A96E]/10 px-3 py-1.5 text-xs text-[#D8BC83]">
              31 Days
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-16 lg:grid-cols-[repeat(31,minmax(0,1fr))]">
            {days.map((day, index) => {
              const completed = index < 9;
              const current = index === 9;

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.025 }}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-xs font-semibold ${
                    completed
                      ? "border-[#3A7D44]/40 bg-[#3A7D44]/15 text-[#9DD3A5]"
                      : current
                      ? "border-[#C9A96E]/50 bg-[#C9A96E]/10 text-[#D8BC83]"
                      : "border-white/10 bg-white/[0.02] text-[#6F7887]"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : current ? (
                    day
                  ) : (
                    <LockKeyhole className="h-3.5 w-3.5" />
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-xs text-[#8B93A1]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3A7D44]" />
              Completed
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C9A96E]" />
              Current
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              Upcoming
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoadmapPreview;