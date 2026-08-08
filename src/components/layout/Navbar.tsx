import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Bot,
  Map,
  Compass,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: <Sparkles className="w-4 h-4 text-[#C9A96E]" /> },
    { name: 'How It Works', href: '#how-it-works', icon: <Compass className="w-4 h-4 text-[#C9A96E]" /> },
    { name: '31-Day Roadmap', href: '#roadmap', icon: <Map className="w-4 h-4 text-[#C9A96E]" /> },
    { name: 'Interview', href: '#interview-preview', icon: <Bot className="w-4 h-4 text-[#C9A96E]" /> },
    { name: 'Profile', href: '#candidate-profile', icon: <User className="w-4 h-4 text-[#C9A96E]" /> },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-[#071426]/90 backdrop-blur-xl border border-[#C9A96E]/25 shadow-2xl shadow-[#071426]/80 py-3 px-4 sm:px-6'
              : 'bg-[#0B1F3A]/70 backdrop-blur-lg border border-white/10 py-3.5 px-4 sm:px-6'
          }`}
          aria-label="Main Navigation"
        >
          <div className="flex items-center justify-between">
            {/* Brand / Logo */}
            <a
              href="#hero"
              onClick={(e) => handleScrollTo(e, '#hero')}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded-lg p-1"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16345C] to-[#0B1F3A] border border-[#C9A96E]/40 shadow-md shadow-[#C9A96E]/15 group-hover:border-[#C9A96E] transition-all duration-300">
                <Bot className="w-5 h-5 text-[#FFFDF7] group-hover:scale-110 group-hover:text-[#C9A96E] transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A96E]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-[#FFFDF7] font-['Outfit']">
                    GrowMore
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#C9A96E]/20 text-[#C9A96E] px-1.5 py-0.5 rounded border border-[#C9A96E]/30">
                    Agent
                  </span>
                </div>
                <span className="text-[11px] text-[#8B93A1] font-medium tracking-wide">
                  AI Interview Agent
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-3.5 py-1.5 text-sm font-medium text-[#C8CDD5] hover:text-[#FFFDF7] hover:bg-white/5 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#interview-preview"
                onClick={(e) => handleScrollTo(e, '#interview-preview')}
                className="text-xs font-semibold text-[#C8CDD5] hover:text-[#FFFDF7] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Sign In
              </a>
              <a
                href="#interview-preview"
                onClick={(e) => handleScrollTo(e, '#interview-preview')}
              >
                <Button
                  variant="gold"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shadow-md shadow-[#C9A96E]/20 font-semibold"
                >
                  Start Interview
                </Button>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href="#interview-preview"
                onClick={(e) => handleScrollTo(e, '#interview-preview')}
              >
                <Button variant="gold" size="sm">
                  Interview
                </Button>
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#C8CDD5] hover:text-[#FFFDF7] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-2 p-4 rounded-2xl bg-[#071426]/95 backdrop-blur-2xl border border-[#C9A96E]/25 shadow-2xl shadow-[#071426]"
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#C8CDD5] hover:text-[#FFFDF7] hover:bg-[#16345C]/50 rounded-xl transition-all"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
              <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-[#8B93A1] px-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3A7D44]" /> Candidate Verified
                  </span>
                  <Badge variant="gold" size="sm">
                    31-Day Cohort
                  </Badge>
                </div>
                <a
                  href="#interview-preview"
                  onClick={(e) => handleScrollTo(e, '#interview-preview')}
                  className="w-full"
                >
                  <Button variant="gold" size="md" className="w-full justify-center">
                    Start AI Technical Interview
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
