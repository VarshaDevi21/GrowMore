import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain, CheckCircle2, Eye } from 'lucide-react';

/**
 * Avatar states for professional AI Technical Interviewer:
 * 'asking' | 'listening' | 'thinking' | 'encouraging' | 'idle'
 */
export const InterviewerAvatar = ({ state = 'idle' }) => {
  const getStateDetails = () => {
    switch (state) {
      case 'asking':
      case 'speaking':
        return {
          label: 'Interviewer Posing Question',
          badgeBg: 'bg-[#071426] text-[#FFFDF7]',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />,
          ringColor: 'border-[#C9A96E]',
        };
      case 'listening':
        return {
          label: 'Awaiting Your Response',
          badgeBg: 'bg-[#FAF7F0] text-[#050E1A] border-[#E2D9C8]',
          icon: <Eye className="w-3.5 h-3.5 text-[#071426]" />,
          ringColor: 'border-[#071426]',
        };
      case 'thinking':
        return {
          label: 'Evaluating Technical Depth...',
          badgeBg: 'bg-[#D97706]/15 text-[#D97706]',
          icon: <Brain className="w-3.5 h-3.5 text-[#D97706] animate-spin" />,
          ringColor: 'border-[#D97706]',
        };
      case 'encouraging':
        return {
          label: 'Response Evaluated',
          badgeBg: 'bg-[#2E7D32]/15 text-[#2E7D32]',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />,
          ringColor: 'border-[#2E7D32]',
        };
      case 'idle':
      default:
        return {
          label: 'AI Technical Interviewer',
          badgeBg: 'bg-[#FAF7F0] text-[#050E1A]',
          icon: <Bot className="w-3.5 h-3.5 text-[#C9A96E]" />,
          ringColor: 'border-[#E2D9C8]',
        };
    }
  };

  const details = getStateDetails();

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Avatar Graphic with Professional Indicator */}
      <div className="relative flex items-center justify-center">
        {state === 'thinking' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute w-24 h-24 rounded-3xl border-2 border-dashed border-[#D97706]/50"
          />
        )}
        {(state === 'asking' || state === 'speaking') && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1.15, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-3xl bg-[#C9A96E]/20 border border-[#C9A96E]/40"
          />
        )}

        {/* Center Main Avatar Box */}
        <div
          className={`w-20 h-20 rounded-3xl bg-[#071426] border-2 ${details.ringColor} shadow-xl flex items-center justify-center relative z-10 transition-all duration-300`}
        >
          <Bot className="w-10 h-10 text-[#FFFDF7]" />

          {/* Online Indicator Badge */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#071426] border-2 border-[#2E7D32] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            </span>
          </span>
        </div>
      </div>

      {/* State Label */}
      <div
        className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold border border-[#E2D9C8] shadow-sm transition-all duration-300 ${details.badgeBg}`}
      >
        {details.icon}
        <span>{details.label}</span>
      </div>
    </div>
  );
};

export default InterviewerAvatar;
