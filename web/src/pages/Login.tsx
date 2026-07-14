import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DriftingEmbers from '../components/DriftingEmbers';

export default function Login() {
  const { setTheme } = useTheme();
  const [totpMode, setTotpMode] = useState(false);

  // Login is strictly Ember
  useEffect(() => {
    setTheme('ember');
  }, [setTheme]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative">
      <DriftingEmbers />
      <div className="z-10 glass-pane p-12 max-w-md w-full relative overflow-hidden">
        <h1 className="text-4xl font-heading mb-8 text-center tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">STREAM<span className="text-[var(--accent-color)]">HOME</span></h1>
        
        <div className={`transition-all duration-500 ease-in-out ${totpMode ? 'opacity-0 translate-x-[-100%] absolute pointer-events-none' : 'opacity-100 translate-x-0 relative'} space-y-8`}>
          <input 
            type="text" 
            placeholder="USERNAME"
            className="w-full bg-transparent border-b border-white/20 focus:border-[var(--accent-color)] focus:border-dashed outline-none py-2 font-mono text-white transition-all duration-300 placeholder:text-white/30"
          />
          <input 
            type="password" 
            placeholder="PASSWORD"
            className="w-full bg-transparent border-b border-white/20 focus:border-[var(--accent-color)] focus:border-dashed outline-none py-2 font-mono text-white transition-all duration-300 placeholder:text-white/30"
          />
          <button onClick={() => setTotpMode(true)} className="w-full bg-[var(--accent-color)] text-black font-bold py-3 mt-4 hover-glow font-mono tracking-widest transition-all">
            AUTHENTICATE
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${!totpMode ? 'opacity-0 translate-x-[100%] absolute pointer-events-none top-24 left-12 right-12' : 'opacity-100 translate-x-0 relative'} space-y-8`}>
          <p className="text-center font-mono text-sm text-[var(--accent-color)] tracking-widest">[ 2FA REQUIRED ]</p>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input 
                key={i}
                type="text" 
                maxLength={1}
                className="w-10 h-12 bg-black/50 border border-white/20 focus:border-[var(--accent-color)] focus:border-dashed outline-none text-center font-mono text-xl text-white transition-all duration-300"
              />
            ))}
          </div>
          <button className="w-full bg-white text-black font-bold py-3 mt-4 hover-glow font-mono tracking-widest transition-all hover:bg-[var(--accent-color)]">
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
}
