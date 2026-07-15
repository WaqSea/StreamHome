import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  className?: string;
}

export function ProgressRing({ progress, size, strokeWidth, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max(progress, 0), 1);
  const offset = circumference - percentage * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={cn("transform -rotate-90", className)}
    >
      <circle
        stroke="var(--border-subtle)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="var(--accent-container)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="transition-all duration-[var(--duration-fast)] ease-[var(--easing-smooth)]"
        style={{
          filter: 'drop-shadow(var(--glow-active))'
        }}
      />
    </svg>
  );
}
