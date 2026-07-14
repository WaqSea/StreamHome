import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function MediaDetailsModal({ isOpen, onClose, mediaId }: { isOpen: boolean, onClose: () => void, mediaId: string | null }) {
  const { theme } = useTheme();

  if (!isOpen || !mediaId) return null;

  // Render different designs based on theme
  const renderThemedModal = () => {
    switch (theme) {
      case 'ember':
        return (
          <div className="fixed inset-x-0 bottom-0 top-32 glass-pane !border-b-0 !border-l-0 !border-r-0 !rounded-t-3xl z-[100] animate-[slideUp_0.3s_ease-out] p-12 overflow-y-auto">
            <button onClick={onClose} className="absolute top-8 right-12 font-mono text-[var(--accent-color)] hover:text-white transition-colors">[ CLOSE ]</button>
            <div className="flex gap-12">
              <div className="w-1/3">
                <div className="aspect-[2/3] bg-gray-900 rounded-xl bg-[url('https://image.tmdb.org/t/p/w500/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-5xl font-heading mb-4 text-white">FIGHT CLUB</h2>
                <div className="flex gap-4 font-mono text-xs text-[var(--accent-color)] mb-8">
                  <span>1999</span>
                  <span>139 MIN</span>
                  <span>4K HDR</span>
                </div>
                <p className="text-lg text-white/80 font-sans mb-12">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
                
                <h3 className="font-heading text-2xl text-[var(--accent-color)] mb-6 border-l-2 border-[var(--accent-color)] pl-4">DATA TIMELINE</h3>
                <div className="space-y-4 pl-4 border-l border-white/10 ml-[9px]">
                  {[1, 2, 3].map(ep => (
                    <div key={ep} className="relative pl-6 hover:bg-white/5 p-4 rounded-lg cursor-pointer transition-colors group">
                      <div className="absolute left-[-22px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border-2 border-white/20 rounded-full group-hover:border-[var(--accent-color)] group-hover:bg-[var(--accent-color)] transition-colors" />
                      <h4 className="font-mono text-lg text-white">EPISODE 0{ep}</h4>
                      <p className="font-sans text-sm text-white/50">45 MIN • DIRECT ENCODE</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'aurora':
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-12 animate-[fadeIn_0.5s_ease]">
             <button onClick={onClose} className="absolute top-12 right-12 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">✕</button>
             <div className="w-full max-w-6xl glass-pane !rounded-[3rem] p-16 flex gap-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://image.tmdb.org/t/p/w1280/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover opacity-20 mix-blend-screen" />
               <div className="relative z-10 max-w-xl">
                 <h2 className="text-6xl font-extrabold mb-6">Fight Club</h2>
                 <p className="text-xl font-light text-white/70 mb-12">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
                 <button className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                   Play Now
                 </button>
               </div>
             </div>
          </div>
        );

      case 'cinema':
        return (
          <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col pt-12 animate-[scaleIn_0.3s_ease]">
             <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl font-light">×</button>
             <div className="w-full max-w-5xl mx-auto flex gap-12 mt-12">
               <img src="https://image.tmdb.org/t/p/w500/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg" className="w-[300px] rounded shadow-[0_0_30px_rgba(229,9,20,0.3)]" alt="Poster" />
               <div>
                 <h2 className="text-6xl font-heading mb-4 text-white">FIGHT CLUB</h2>
                 <p className="text-xl text-gray-300 mb-8 font-sans">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
                 <div className="grid grid-cols-2 gap-4">
                   <button className="bg-[var(--accent-color)] text-white py-4 rounded font-bold text-xl hover:bg-red-700 transition-colors">▶ PLAY</button>
                   <button className="border-2 border-white text-white py-4 rounded font-bold text-xl hover:bg-white hover:text-black transition-colors">+ MY LIST</button>
                 </div>
               </div>
             </div>
          </div>
        );

      case 'gemini':
        return (
          <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md z-[100] p-8 flex items-center justify-center">
             <div className="w-full max-w-7xl h-[80vh] relative">
               <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors">Close ✕</button>
               <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-dark)] rounded-[3rem] blur-xl opacity-20" />
               <div className="absolute inset-0 bg-black rounded-[3rem] border border-white/10 p-16 flex gap-12">
                 <div className="flex-1">
                   <h2 className="text-6xl font-heading font-bold mb-6">Fight Club</h2>
                   <p className="text-xl text-white/60 mb-12 leading-relaxed">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
                 </div>
                 <div className="w-[400px]">
                   <div className="aspect-[2/3] rounded-2xl bg-[url('https://image.tmdb.org/t/p/w500/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover" />
                 </div>
               </div>
             </div>
          </div>
        );
    }
  };

  return renderThemedModal();
}
