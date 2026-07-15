import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/api';
import { formatDuration } from '../../utils/format';

interface AuroraDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export function AuroraDetails({ movie, onClose }: AuroraDetailsProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 text-[var(--text-primary)]"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(50px)',
      }}
      data-theme="aurora"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div 
        className="w-full max-w-5xl rounded-[32px] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        style={{
          background: 'var(--glass-fill)',
          border: '1px solid var(--glass-border)'
        }}
      >
        {/* Poster side */}
        <div className="w-full md:w-2/5 relative">
          <img 
            src={movie.poster_url || ''} 
            alt={movie.title}
            className="w-full h-full object-cover min-h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--glass-fill)]" />
        </div>

        {/* Content side */}
        <div className="w-full md:w-3/5 p-12 flex flex-col justify-center">
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-semibold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {movie.title}
          </h1>
          
          <div className="flex gap-4 font-[family-name:var(--font-body)] text-[var(--text-secondary)] text-sm mb-8">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5">4K VISION</span>
            {movie.year && <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5">{movie.year}</span>}
            {movie.duration && <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5">{formatDuration(movie.duration)}</span>}
          </div>

          <p className="font-[family-name:var(--font-body)] text-[var(--text-primary)] text-lg leading-relaxed mb-10 opacity-90">
            {movie.plot}
          </p>

          <div className="flex gap-6 mt-auto">
            <button 
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            <button className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-semibold tracking-wide transition-colors">
              Add to List
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
