import { motion } from "framer-motion";

const stats = [
  ["31", "Learning Days"],
  ["10", "Interview Questions"],
  ["4+", "Curriculum Days Covered"],
  ["20 min", "Maximum Interview"],
];

function ProductStats() {
  return (
    <section className="border-y border-white/5 bg-[#0B1F3A]/40 px-4 py-8 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {stats.map(([value, label], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border-white/10 px-4 py-3 text-center md:border-r last:border-r-0"
          >
            <p className="text-2xl font-semibold sm:text-3xl">
              {value}
            </p>

            <p className="mt-1 text-xs text-[#8B93A1] sm:text-sm">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProductStats;