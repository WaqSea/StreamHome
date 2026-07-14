import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function VideoPlayer() {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const renderEmberPlayer = () => (
    <div className="absolute inset-0 bg-black text-white font-mono z-50">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <button className="text-[var(--accent-color)] hover:text-white transition-colors">[ BACK ]</button>
        <span className="tracking-widest">FIGHT CLUB</span>
      </div>
      
      {/* Tactical HUD Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm">01:23:45</span>
          <div className="flex-1 h-[2px] bg-white/20 relative group cursor-pointer">
            <div className="absolute inset-y-0 left-0 bg-[var(--accent-color)] w-1/3" />
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-1 h-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-sm">02:19:00</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-8 text-2xl">
            <button className="hover:text-[var(--accent-color)] transition-colors">⏯</button>
            <button className="hover:text-[var(--accent-color)] transition-colors">⏮</button>
            <button className="hover:text-[var(--accent-color)] transition-colors">⏭</button>
          </div>
          <div className="flex gap-6 text-sm tracking-widest">
            <button className="glass-pane px-4 py-1 hover:border-[var(--accent-color)] hover:border-dashed">SUBTITLES</button>
            <button className="glass-pane px-4 py-1 hover:border-[var(--accent-color)] hover:border-dashed">QUALITY</button>
          </div>
        </div>
      </div>
      
      {/* Skip Intro Glitch Overlay Example */}
      <button className="absolute bottom-32 right-12 glass-pane px-6 py-2 border-[var(--accent-color)] border-dashed text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black font-bold tracking-widest transition-colors shadow-[0_0_15px_rgba(255,95,31,0.3)]">
        SKIP INTRO
      </button>
    </div>
  );

  const renderAuroraPlayer = () => (
    <div className="absolute inset-0 bg-black text-white font-sans z-50 overflow-hidden">
      <div className="absolute top-8 left-8">
        <button className="w-12 h-12 glass-pane !rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">←</button>
      </div>
      
      {/* Spatial Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl glass-pane !rounded-3xl p-6 backdrop-blur-[50px] bg-white/5 border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono opacity-50">1:23:45</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-white w-1/3 rounded-full" />
          </div>
          <span className="text-xs font-mono opacity-50">2:19:00</span>
        </div>
        
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-6 items-center">
            <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">⏯</button>
            <button className="opacity-70 hover:opacity-100 transition-opacity">⏮</button>
            <button className="opacity-70 hover:opacity-100 transition-opacity">⏭</button>
          </div>
          <div className="font-bold tracking-wider">Fight Club</div>
          <div className="flex gap-4">
            <button className="opacity-70 hover:opacity-100 transition-opacity">CC</button>
            <button className="opacity-70 hover:opacity-100 transition-opacity">HD</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the themed player
  return theme === 'ember' ? renderEmberPlayer() : renderAuroraPlayer();
}
