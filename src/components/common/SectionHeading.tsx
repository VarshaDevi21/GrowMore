import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './Badge';

export interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  highlightedTitle?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeIcon,
  title,
  highlightedTitle,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-left'} mb-14 sm:mb-18 ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`mb-4 flex ${isCenter ? 'justify-center' : 'justify-start'}`}
        >
          <Badge variant="gold" icon={badgeIcon} pulse>
            {badge}
          </Badge>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FFFDF7] leading-[1.15]"
      >
        {title}{' '}
        {highlightedTitle && (
          <span className="bg-gradient-to-r from-[#FFFDF7] via-[#F7F1E3] to-[#C9A96E] bg-clip-text text-transparent block sm:inline">
            {highlightedTitle}
          </span>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[#C8CDD5] leading-relaxed max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
