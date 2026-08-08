import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Interview", href: "#interview" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#071426]/80 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9A96E]/30 bg-[#C9A96E]/10">
            <BrainCircuit className="h-5 w-5 text-[#C9A96E]" />
          </div>

          <span className="hidden text-sm font-semibold sm:block">
            AI Interview Agent
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[#C8CDD5] transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-xl px-4 py-2 text-sm text-[#C8CDD5] transition hover:text-white">
            Login
          </button>

          <a
            href="#interview"
            className="group flex items-center gap-2 rounded-xl bg-[#F7F1E3] px-4 py-2.5 text-sm font-semibold text-[#071426] transition hover:bg-[#C9A96E]"
          >
            Start Interview
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-white/10 p-2 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 rounded-2xl border border-white/10 bg-[#0B1F3A]/95 p-4 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-[#C8CDD5] transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <div className="my-2 h-px bg-white/10" />

              <button className="rounded-xl px-4 py-3 text-left text-sm text-[#C8CDD5]">
                Login
              </button>

              <a
                href="#interview"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#F7F1E3] px-4 py-3 text-center text-sm font-semibold text-[#071426]"
              >
                Start Interview
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;