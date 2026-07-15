import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <div className={cn("w-full h-[2px] bg-[var(--border-subtle)] relative overflow-hidden", className)}>
      <div 
        className="absolute top-0 left-0 h-full bg-[var(--accent-container)] transition-all duration-[var(--duration-fast)] ease-[var(--easing-smooth)]"
        style={{ 
          width: `${percentage}%`,
          boxShadow: 'var(--glow-active)'
        }}
      />
    </div>
  );
}
