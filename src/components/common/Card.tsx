import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'glass' | 'navy' | 'gold-border' | 'solid';
  glow?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  glow = false,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const variantStyles = {
    glass:
      'bg-[#0B1F3A]/70 backdrop-blur-xl border border-[#C9A96E]/15 shadow-xl shadow-[#071426]/50',
    navy:
      'bg-[#0B1F3A] border border-[#16345C] shadow-lg shadow-[#071426]/60',
    'gold-border':
      'bg-[#0B1F3A]/90 backdrop-blur-xl border border-[#C9A96E]/40 shadow-2xl shadow-[#C9A96E]/5',
    solid:
      'bg-[#16345C]/50 border border-white/10',
  };

  const glowStyles = glow
    ? 'relative before:absolute before:-inset-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-[#C9A96E]/20 before:via-transparent before:to-[#16345C]/40 before:-z-10'
    : '';

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              borderColor: 'rgba(201, 169, 110, 0.4)',
              boxShadow: '0 20px 40px -15px rgba(7, 20, 38, 0.9), 0 0 25px -5px rgba(201, 169, 110, 0.15)',
              transition: { duration: 0.25 },
            }
          : undefined
      }
      className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden transition-colors ${variantStyles[variant]} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
