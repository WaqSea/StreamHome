import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '../../utils/format';
import { GlassPane } from '../../components/ui/GlassPane';

export function AuroraPlayer(props: any) {
  const { 
    isPlaying, currentTime, duration, showControls, 
    onPlayPause, onSeek, onExit, title 
  } = props;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none" data-theme="aurora">
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 backdrop-blur-[10px] z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-6"
          >
            <GlassPane className="px-8 py-3 rounded-full flex items-center gap-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <button onClick={onExit} className="text-white hover:text-[var(--text-accent)] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="font-[family-name:var(--font-headline)] font-semibold tracking-wide text-white">
                {title}
              </h1>
            </GlassPane>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 pointer-events-auto z-50"
          >
            <GlassPane className="w-full p-4 rounded-3xl flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <button onClick={onPlayPause} className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform flex-shrink-0">
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              
              <div className="flex-1 h-3 bg-white/20 rounded-full relative cursor-pointer group" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onSeek(((e.clientX - rect.left) / rect.width) * duration);
              }}>
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full pointer-events-none"
                  style={{ width: `${progressPercent}%` }}
                />
                {/* VisionOS Orb Handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              <div className="font-[family-name:var(--font-mono)] text-sm tracking-widest text-white/80 w-[120px] text-right">
                {formatDuration(currentTime)}
              </div>
            </GlassPane>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
