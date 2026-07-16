import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  
  const baseClasses = "inline-flex items-center justify-center font-[family-name:var(--font-mono)] uppercase tracking-[0.1em] transition-[transform,box-shadow,opacity] duration-[480ms] ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:scale-[1.04] active:translate-y-0 active:scale-[.98] cursor-pointer select-none rounded-[var(--radius)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };
  
  const variantClasses = {
    primary: "bg-[var(--glass-fill)] border border-[var(--glass-border-hover)] text-[var(--text-accent)] hover:shadow-[var(--glow-intense)]",
    secondary: "bg-transparent border border-[var(--glass-border)] text-white hover:shadow-[var(--glow-subtle)]",
    ghost: "bg-transparent text-[var(--text-secondary)] border border-transparent hover:shadow-[var(--glow-subtle)]"
  };

  return (
    <button
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
