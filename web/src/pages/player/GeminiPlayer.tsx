import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '../../utils/format';
import { GlassPane } from '../../components/ui/GlassPane';

export function GeminiPlayer(props: any) {
  const { 
    isPlaying, currentTime, duration, showControls, 
    onPlayPause, onSeek, onExit, title 
  } = props;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none" data-theme="gemini">
      {/* Ambilight edge glow on pause */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_150px_rgba(66,133,244,0.3)] bg-white/5 backdrop-blur-[5px]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-12 left-12 right-12 pointer-events-auto z-50 flex flex-col gap-6"
          >
            <GlassPane className="w-full p-6 flex flex-col gap-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[var(--glass-border)] bg-[var(--glass-fill)] backdrop-blur-xl">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  <button onClick={onPlayPause} className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors">
                    {isPlaying ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                  <h1 className="font-[family-name:var(--font-headline)] text-xl font-medium tracking-wide text-[var(--text-primary)]">
                    {title}
                  </h1>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="font-[family-name:var(--font-mono)] text-sm tracking-widest text-[var(--text-secondary)]">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </div>
                  <button onClick={onExit} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 bg-white/5 rounded-full border border-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  </button>
                </div>
              </div>

              {/* Gradient Scrubber */}
              <div className="relative w-full h-3 bg-black/20 rounded-full cursor-pointer group shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onSeek(((e.clientX - rect.left) / rect.width) * duration);
              }}>
                <div 
                  className="absolute top-0 left-0 h-full rounded-full pointer-events-none transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(66,133,244,0.6)]"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #4285F4, #34A853)'
                  }}
                />
              </div>
            </GlassPane>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
