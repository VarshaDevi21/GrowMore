import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Mail,
  MapPin,
  ArrowRight,
  Phone,
  Globe,
  Sparkles,
  ExternalLink,
  Heart,
  Video,
} from 'lucide-react';

export const Footer = () => {
  const abTalksSocials = [
    {
      name: 'YouTube (#ABTalks)',
      handle: '@abtalks',
      href: 'https://www.youtube.com/@abtalks',
      color: 'hover:text-[#FF0000]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Instagram (#ABTalks)',
      handle: '@abtalks',
      href: 'https://www.instagram.com/abtalks/',
      color: 'hover:text-[#E4405F]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Anas Bukhash',
      handle: '@anasbukhash',
      href: 'https://www.instagram.com/anasbukhash/',
      color: 'hover:text-[#C9A96E]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'Bukhash Brothers',
      handle: 'bukhashbrothers.com',
      href: 'https://bukhashbrothers.com',
      color: 'hover:text-[#071426]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t-2 border-[#E2D9C8] bg-[#F5EFE0] pt-16 pb-12 text-[#050E1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* #ABTalks Showcase Banner */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 bg-[#071426] text-[#FFFDF7] border-2 border-[#C9A96E]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase bg-[#C9A96E] text-[#071426] px-3 py-1 rounded-md tracking-wider">
                #ABTalks Edition
              </span>
              <span className="text-xs font-mono font-bold text-[#E2D9C8] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> In Collaboration with Bukhash Brothers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
              Humanizing Technical Interviews, One Conversation at a Time.
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-2xl font-medium leading-relaxed">
              Inspired by the raw, in-depth, and empathetic interview style of <strong>Anas Bukhash</strong> (#ABTalks). We combine human active listening with rigorous AI engineering diagnostics.
            </p>
          </div>

          <a
            href="https://www.youtube.com/@abtalks"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#C9A96E] hover:bg-[#D8B97E] text-[#071426] shadow-lg flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Watch #ABTalks</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-8 border-b border-[#E2D9C8]">
          {/* Column 1: Brand & #ABTalks Philosophy (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#071426] border border-[#C9A96E]/40 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-[#FFFDF7]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-[#050E1A] font-['Outfit']">
                    GrowMore
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#071426] text-[#FFFDF7] px-2 py-0.5 rounded font-bold">
                    #ABTalks
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#334155]">
                  AI Interview Agent · Produced for #ABTalks
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#1E293B] max-w-md leading-relaxed font-medium">
              An intelligent evaluation agent built on the core #ABTalks belief: technical prowess begins with genuine self-discovery, deep probing questions, and constructive growth telemetry.
            </p>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping" />
              <span>Bukhash Brothers Studio Verified · Dubai, UAE</span>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#050E1A] font-extrabold block">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs font-semibold text-[#334155]">
              <li>
                <Link to="/" className="hover:text-[#050E1A] hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#050E1A] hover:underline transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#050E1A] hover:underline transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#071426] font-bold hover:underline flex items-center gap-1">
                  <span>Candidate Login</span>
                  <ArrowRight className="w-3 h-3 text-[#C9A96E]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: #ABTalks Official Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#050E1A] font-extrabold block">
              #ABTalks Studio & Contact
            </span>
            <ul className="space-y-3 text-xs text-[#334155] font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#071426] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#050E1A] block">Bukhash Brothers Headquarters</span>
                  <span className="text-[11px] text-[#475569]">Dubai Design District (d3), Building 6, Dubai, UAE</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#071426] shrink-0" />
                <div>
                  <a href="mailto:talks@bukhashbrothers.com" className="font-bold text-[#050E1A] hover:underline block">
                    talks@bukhashbrothers.com
                  </a>
                  <a href="mailto:contact@abtalks.ae" className="text-[11px] text-[#475569] hover:underline">
                    contact@abtalks.ae
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#071426] shrink-0" />
                <a href="tel:+97145847333" className="font-bold text-[#050E1A] hover:underline">
                  +971 4 584 7333 (Dubai HQ)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#071426] shrink-0" />
                <a href="https://abtalks.ae" target="_blank" rel="noopener noreferrer" className="font-bold text-[#050E1A] hover:underline">
                  www.abtalks.ae
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Socials & Media Handles (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#050E1A] font-extrabold block">
              Official Channels
            </span>
            <div className="flex flex-col space-y-2 text-xs font-semibold text-[#334155]">
              {abTalksSocials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 hover:underline transition-colors ${social.color}`}
                >
                  <div className="w-6 h-6 rounded-lg bg-[#FFFFFF] border border-[#E2D9C8] flex items-center justify-center text-[#071426] shadow-sm shrink-0">
                    {social.icon}
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-tight text-[#050E1A]">{social.name}</span>
                    <span className="text-[10px] font-mono text-[#475569]">{social.handle}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#475569]">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-current" />
            <span>Curated with authenticity for <strong>#ABTalks & Bukhash Brothers</strong>.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] bg-[#FFFFFF] border border-[#E2D9C8] px-2.5 py-1 rounded-md text-[#050E1A] font-bold">
              31-Day Cohort × #ABTalks
            </span>
            <Link to="/login" className="text-[#071426] font-bold hover:underline">
              Start Technical Interview →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
