import React from 'react';

export interface BadgeProps {
  variant?: 'gold' | 'navy' | 'success' | 'warning' | 'error' | 'muted' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  size = 'sm',
  children,
  icon,
  className = '',
  pulse = false,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wide',
    md: 'text-xs px-3 py-1 font-medium',
  };

  const variantStyles = {
    gold: 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30',
    navy: 'bg-[#0B1F3A] text-[#FFFDF7] border border-[#16345C]',
    success: 'bg-[#3A7D44]/20 text-[#68D391] border border-[#3A7D44]/40',
    warning: 'bg-[#C58B2A]/20 text-[#F6AD55] border border-[#C58B2A]/40',
    error: 'bg-[#B54747]/20 text-[#FC8181] border border-[#B54747]/40',
    muted: 'bg-white/5 text-[#C8CDD5] border border-white/10',
    outline: 'bg-transparent text-[#C9A96E] border border-[#C9A96E]/50',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider font-mono font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
