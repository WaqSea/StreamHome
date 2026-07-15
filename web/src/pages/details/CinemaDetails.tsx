import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/api';
import { formatDuration } from '../../utils/format';

interface CinemaDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export function CinemaDetails({ movie, onClose }: CinemaDetailsProps) {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in text slightly after mount for dramatic effect
    const timeout = setTimeout(() => setOpacity(1), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-[#141414] text-white flex flex-col"
      data-theme="cinema"
    >
      {/* Background Poster */}
      <div className="absolute inset-0 z-0">
        <img 
          src={movie.backdrop_url || movie.poster_url || ''} 
          alt={movie.title}
          className="w-full h-[80vh] object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent" />
      </div>

      <button 
        onClick={onClose}
        className="absolute top-12 right-12 z-50 text-white/70 hover:text-white transition-colors"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-end px-16 pb-24">
        <div 
          className="w-full max-w-3xl transition-opacity duration-1000 ease-out"
          style={{ opacity }}
        >
          <h1 className="font-[family-name:var(--font-headline)] text-6xl md:text-8xl font-black tracking-tight mb-4 drop-shadow-2xl text-[var(--text-accent)]">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 font-[family-name:var(--font-body)] text-[16px] font-semibold text-white/90 mb-8 drop-shadow-md">
            <span className="text-green-500 font-bold">98% Match</span>
            {movie.year && <span>{movie.year}</span>}
            <span className="border border-white/40 px-2 rounded-sm text-sm text-white/70">TV-MA</span>
            {movie.duration && <span>{formatDuration(movie.duration)}</span>}
            <span className="border border-white/40 px-2 rounded-sm text-sm text-white/70">HD</span>
          </div>

          <p className="font-[family-name:var(--font-body)] text-xl leading-snug mb-10 text-white/80 max-w-2xl drop-shadow-md">
            {movie.plot}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="px-10 py-4 rounded-md bg-white text-black font-bold text-xl hover:bg-white/80 transition-colors flex items-center gap-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            <button className="px-10 py-4 rounded-md bg-white/20 text-white font-bold text-xl border border-white/40 hover:bg-white/30 transition-colors flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              My List
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
