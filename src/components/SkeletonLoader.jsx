import React from 'react';

export const SkeletonCard = ({ rows = 3, className = '' }) => {
  return (
    <div className={`card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] space-y-4 animate-pulse ${className}`}>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-[#E2D9C8]/60 rounded-lg w-1/3" />
        <div className="h-4 bg-[#E2D9C8]/60 rounded-lg w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-3 bg-[#E2D9C8]/40 rounded-md w-full" style={{ width: `${85 - idx * 15}%` }} />
      ))}
      <div className="pt-2 flex justify-between">
        <div className="h-6 bg-[#E2D9C8]/50 rounded-xl w-24" />
        <div className="h-6 bg-[#E2D9C8]/50 rounded-xl w-20" />
      </div>
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col sm:flex-row items-center gap-6 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-[#E2D9C8]/60 shrink-0" />
      <div className="space-y-2 flex-grow w-full">
        <div className="h-6 bg-[#E2D9C8]/60 rounded-lg w-1/2" />
        <div className="h-4 bg-[#E2D9C8]/40 rounded-md w-3/4" />
        <div className="h-3 bg-[#E2D9C8]/30 rounded-md w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;
