import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#0B1F3A] hover:bg-[#16345C] text-[#FFFDF7] border border-[#C9A96E]/30 shadow-lg shadow-[#071426]/50 hover:border-[#C9A96E]/60 hover:shadow-[#C9A96E]/10',
    secondary:
      'bg-[#16345C]/60 hover:bg-[#16345C] text-[#FFFDF7] border border-white/10 hover:border-white/20',
    gold:
      'bg-gradient-to-r from-[#C9A96E] via-[#D8BA82] to-[#B89354] hover:from-[#D8BA82] hover:to-[#C9A96E] text-[#071426] font-semibold shadow-lg shadow-[#C9A96E]/20 hover:shadow-[#C9A96E]/40 hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-[#0B1F3A]/60 text-[#FFFDF7] border border-[#C9A96E]/40 hover:border-[#C9A96E] hover:text-[#C9A96E]',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#C8CDD5] hover:text-[#FFFDF7]',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};
