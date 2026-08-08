import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Menu,
  X,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Map,
  PlayCircle,
  TrendingUp,
  User,
} from 'lucide-react';
import { getSelectedCandidateId, getCandidateById, clearSelectedCandidate } from '../data/candidate';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);
  const isAuthenticated = Boolean(candidateId && candidate);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearSelectedCandidate();
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Public Links (Before Login)
  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Authenticated Candidate Links (After Login)
  const authNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { name: '31-Day Roadmap', path: '/roadmap', icon: <Map className="w-3.5 h-3.5" /> },
    { name: 'Interview', path: '/interview-setup', icon: <PlayCircle className="w-3.5 h-3.5" /> },
    { name: 'Track & Improve', path: '/track-improve', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-3.5 h-3.5" /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <motion.nav
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`relative rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#E2D9C8] shadow-lg shadow-[#071426]/5 py-3 px-4 sm:px-6'
              : 'bg-[#FAF7F0]/90 backdrop-blur-md border border-[#E2D9C8] py-3.5 px-4 sm:px-6'
          }`}
          aria-label="Navigation"
        >
          <div className="flex items-center justify-between">
            {/* Brand / Logo */}
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#071426] rounded-xl p-1"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#071426] border border-[#C9A96E]/40 shadow-sm group-hover:bg-[#16345C] transition-all duration-200">
                <Bot className="w-5 h-5 text-[#FFFDF7] group-hover:scale-105 transition-transform duration-200" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-[#050E1A] font-['Outfit']">
                    GrowMore
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#071426] text-[#FFFDF7] px-1.5 py-0.5 rounded font-bold">
                    Agent
                  </span>
                </div>
                <span className="text-[11px] text-[#475569] font-medium tracking-wide">
                  AI Interview Agent
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {isAuthenticated
                ? authNavLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-[#071426] text-[#FFFDF7] shadow-sm'
                            : 'text-[#334155] hover:text-[#050E1A] hover:bg-[#F3EEE3]'
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    );
                  })
                : publicNavLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-[#071426] text-[#FFFDF7] shadow-sm'
                            : 'text-[#334155] hover:text-[#050E1A] hover:bg-[#F3EEE3]'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
            </div>

            {/* Right Action (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* Candidate Name Badge */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2D9C8] hover:border-[#071426] transition-all shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#071426] text-[#FFFDF7] flex items-center justify-center text-[10px] font-mono font-bold">
                      {candidate.member.id.replace('CAND-', '#')}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#050E1A] leading-tight">
                        {candidate.member.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#475569] leading-tight">
                        {candidate.member.id}
                      </span>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE8DC] border border-[#E2D9C8] text-[#050E1A] hover:text-[#DC2626] transition-all cursor-pointer shadow-sm"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs px-5 py-2.5 rounded-xl font-bold bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md shadow-[#071426]/15 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              {isAuthenticated ? (
                <span className="text-xs font-mono font-bold text-[#050E1A] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E2D9C8]">
                  {candidate.member.id}
                </span>
              ) : (
                <Link
                  to="/login"
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#071426] text-[#FFFDF7]"
                >
                  Get Started
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#050E1A] hover:bg-[#F3EEE3] focus:outline-none focus:ring-2 focus:ring-[#071426]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#E2D9C8] shadow-xl"
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="p-3 mb-2 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#071426] text-[#FFFDF7] flex items-center justify-center text-xs font-mono font-bold">
                        {candidate.member.id.replace('CAND-', '#')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#050E1A]">{candidate.member.name}</p>
                        <p className="text-[10px] text-[#475569]">{candidate.member.jobRole}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded">
                      {candidate.member.id}
                    </span>
                  </div>

                  {authNavLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                          active
                            ? 'bg-[#071426] text-[#FFFDF7]'
                            : 'text-[#334155] hover:text-[#050E1A] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}

                  <div className="pt-3 border-t border-[#EFE8DC]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF7F0] text-[#DC2626] border border-[#E2D9C8] text-xs font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {publicNavLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                          active
                            ? 'bg-[#071426] text-[#FFFDF7]'
                            : 'text-[#334155] hover:text-[#050E1A] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}

                  <div className="pt-4 mt-3 border-t border-[#EFE8DC]">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#071426] text-[#FFFDF7] text-xs font-bold shadow-md"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
