import React from 'react';
import { cn } from '../../utils/cn';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center",
        "border border-[var(--glass-border-hover)] px-4 py-1.5 rounded-[var(--radius)]",
        "font-[family-name:var(--font-mono)] text-[12px] tracking-[0.1em] uppercase",
        "text-[var(--text-accent)] transition-all duration-[var(--duration-fast)] ease-[var(--easing-smooth)]",
        active 
          ? "bg-[rgba(255,95,31,0.15)] shadow-[var(--glow-active)]" 
          : "bg-transparent hover:bg-[rgba(255,95,31,0.15)] hover:shadow-[var(--glow-active)]",
        className
      )}
    >
      {label}
    </button>
  );
}
