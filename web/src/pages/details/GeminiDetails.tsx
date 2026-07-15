import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/api';
import { formatDuration } from '../../utils/format';

interface GeminiDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export function GeminiDetails({ movie, onClose }: GeminiDetailsProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-y-0 right-0 w-full md:w-[600px] z-[100] flex flex-col shadow-2xl"
      style={{
        background: 'var(--glass-fill)',
        backdropFilter: 'blur(var(--glass-blur))',
        borderLeft: '1px solid var(--glass-border)'
      }}
      data-theme="gemini"
    >
      <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
        <h2 className="font-[family-name:var(--font-headline)] text-[var(--text-primary)] text-xl tracking-wide">
          Media Information
        </h2>
        <button 
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 relative shadow-lg">
          <img 
            src={movie.backdrop_url || movie.poster_url || ''} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="font-[family-name:var(--font-headline)] text-4xl font-semibold mb-4 text-[var(--text-primary)]">
          {movie.title}
        </h1>
        
        <div className="flex gap-3 font-[family-name:var(--font-mono)] text-[var(--text-secondary)] text-sm mb-6">
          <span className="bg-[var(--glass-fill)] px-2 py-1 rounded-md border border-[var(--glass-border)]">HDR</span>
          {movie.year && <span className="bg-[var(--glass-fill)] px-2 py-1 rounded-md border border-[var(--glass-border)]">{movie.year}</span>}
          {movie.duration && <span className="bg-[var(--glass-fill)] px-2 py-1 rounded-md border border-[var(--glass-border)]">{formatDuration(movie.duration)}</span>}
        </div>

        <p className="font-[family-name:var(--font-body)] text-[var(--text-primary)] leading-relaxed mb-10 opacity-90">
          {movie.plot}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="w-full py-4 rounded-xl bg-[var(--text-accent)] text-white font-medium text-lg hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(66,133,244,0.4)]"
          >
            Play Media
          </button>
          <button className="w-full py-4 rounded-xl bg-[var(--glass-fill)] border border-[var(--glass-border-hover)] text-[var(--text-primary)] font-medium text-lg hover:bg-[rgba(255,255,255,0.05)] transition-all">
            Save for Later
          </button>
        </div>
      </div>
    </motion.div>
  );
}
