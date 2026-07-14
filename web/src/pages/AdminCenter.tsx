import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminCenter() {
  const { setTheme } = useTheme();
  const [sudoMode, setSudoMode] = useState(false);
  const [showSudoPrompt, setShowSudoPrompt] = useState(false);

  // Admin Center forces Ember theme
  useEffect(() => {
    setTheme('ember');
  }, [setTheme]);

  const handleCriticalAction = () => {
    if (!sudoMode) {
      setShowSudoPrompt(true);
    } else {
      alert("CRITICAL ACTION EXECUTED");
    }
  };

  const handleSudoVerify = () => {
    setSudoMode(true);
    setShowSudoPrompt(false);
  };

  return (
    <div className="min-h-screen w-full bg-black p-12 text-white font-sans relative">
      {/* Sudo Prompt Overlay */}
      {showSudoPrompt && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-8 backdrop-blur-md">
          <div className="glass-pane p-12 max-w-md w-full border-[var(--accent-color)] border-dashed shadow-[0_0_30px_rgba(255,95,31,0.5)]">
            <h2 className="text-3xl font-heading mb-4 text-[var(--accent-color)]">SUDO VERIFICATION</h2>
            <p className="font-mono text-sm text-white/70 mb-8">Elevated privileges required for this action. Please enter your TOTP code.</p>
            <div className="flex gap-2 justify-center mb-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1}
                  className="w-12 h-14 bg-black/50 border border-white/20 focus:border-[var(--accent-color)] outline-none text-center font-mono text-2xl text-white"
                />
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowSudoPrompt(false)} className="flex-1 glass-pane py-3 font-mono tracking-widest hover:bg-white/10 transition-colors">CANCEL</button>
              <button onClick={handleSudoVerify} className="flex-1 bg-[var(--accent-color)] text-black font-bold py-3 hover-glow font-mono tracking-widest transition-all">VERIFY</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-4xl font-heading mb-2">Command Center</h1>
            <p className="font-mono text-sm text-[var(--accent-color)] tracking-widest">
              [ SECURE CONNECTION ESTABLISHED ] 
              {sudoMode && <span className="ml-4 text-green-500 animate-pulse">[ SUDO GRANTED ]</span>}
            </p>
          </div>
          <div className="font-mono text-sm opacity-50">
            SYSTEM.UPTIME: 14:02:44
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="glass-pane p-8">
              <h2 className="text-xl font-heading mb-6 border-b border-white/10 pb-4">Storage Matrix</h2>
              <div className="h-48 border border-white/5 bg-white/5 flex items-center justify-center font-mono opacity-50">
                [ RCLONE MOUNT METRICS ]
              </div>
              <button onClick={handleCriticalAction} className="mt-4 border border-[var(--accent-color)] text-[var(--accent-color)] px-4 py-2 font-mono text-sm hover:bg-[var(--accent-color)] hover:text-black transition-colors">
                PURGE CACHE (REQUIRES SUDO)
              </button>
            </section>
            
            <section className="glass-pane p-8">
              <h2 className="text-xl font-heading mb-6 border-b border-white/10 pb-4">Active Operations</h2>
              <div className="space-y-4">
                <div className="flex justify-between font-mono text-sm">
                  <span>HEVC_WORKER_01</span>
                  <span className="text-[var(--accent-color)]">ENCODING... 44%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="h-full bg-[var(--accent-color)] w-[44%]"></div>
                </div>
                <button onClick={handleCriticalAction} className="mt-4 border border-red-500 text-red-500 px-4 py-2 font-mono text-sm hover:bg-red-500 hover:text-white transition-colors">
                  KILL WORKER
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="glass-pane p-8">
              <h2 className="text-xl font-heading mb-6 border-b border-white/10 pb-4">Access Control</h2>
              <ul className="font-mono space-y-4 opacity-70">
                <li className="flex justify-between hover:text-[var(--accent-color)] cursor-pointer">
                  <span>USER_DENIZ</span>
                  <span>[ ACTIVE ]</span>
                </li>
                <li className="flex justify-between hover:text-[var(--accent-color)] cursor-pointer">
                  <span>USER_ALICE</span>
                  <span>[ 2FA REQ ]</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
