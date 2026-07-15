import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '../../utils/format';

export function CinemaPlayer(props: any) {
  const { 
    isPlaying, currentTime, duration, showControls, 
    onPlayPause, onSeek, onExit, title 
  } = props;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none" data-theme="cinema">
      {/* Heavy vignette on pause */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.9) 100%)'
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 w-full px-12 pb-12 pt-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto z-50 flex flex-col"
          >
            <div className="flex items-center gap-6 mb-8">
              <button onClick={onPlayPause} className="text-white hover:text-[#E50914] transition-colors">
                {isPlaying ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <div>
                <h1 className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-wide text-white">{title}</h1>
              </div>
              <div className="ml-auto font-[family-name:var(--font-mono)] text-xl font-bold text-white/80">
                {formatDuration(currentTime)} <span className="text-white/40">/</span> {formatDuration(duration)}
              </div>
              <button onClick={onExit} className="ml-4 text-white/50 hover:text-white transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
            </div>

            {/* Bold Red Scrubber */}
            <div className="relative w-full h-2 bg-white/20 cursor-pointer group" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSeek(((e.clientX - rect.left) / rect.width) * duration);
            }}>
              <div 
                className="absolute top-0 left-0 h-full bg-[#E50914] transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E50914] transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
