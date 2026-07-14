import React from 'react';

export default function AuroraHome({ tab }: { tab: string }) {
  return (
    <div className="w-full min-h-screen text-white font-sans p-8 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-fixed">
      {/* Heavy Blur Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[100px] z-[-1]" />
      
      {/* Floating Pill Nav */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 h-14 glass-pane !rounded-full z-50 flex items-center px-8 gap-8 backdrop-blur-3xl bg-white/5 border-white/10 shadow-2xl">
        <div className="font-bold tracking-widest text-white/90">STREAM<span className="text-white/50">HOME</span></div>
        <div className="w-px h-6 bg-white/20"></div>
        <div className="flex gap-6 font-medium text-sm text-white/70">
          <a href="/" className={tab === 'home' ? 'text-white' : 'hover:text-white transition-colors'}>HOME</a>
          <a href="/movies" className={tab === 'movies' ? 'text-white' : 'hover:text-white transition-colors'}>MOVIES</a>
          <a href="/series" className={tab === 'series' ? 'text-white' : 'hover:text-white transition-colors'}>SERIES</a>
          <a href="/downloads" className={tab === 'downloads' ? 'text-white' : 'hover:text-white transition-colors'}>DOWNLOADS</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-24">
        {/* Spatial Liquid Glass Hero */}
        <div className="w-full h-[50vh] glass-pane !rounded-3xl mb-16 relative overflow-hidden flex items-center p-16 hover-glow group">
          <div className="absolute top-0 right-0 w-[800px] h-full bg-[url('https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover bg-center opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          
          <div className="relative z-20 max-w-xl">
            <h2 className="text-7xl font-extrabold mb-6 tracking-tighter">FIGHT CLUB</h2>
            <p className="text-white/70 mb-10 leading-relaxed font-light text-lg">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              Watch Experience
            </button>
          </div>
        </div>

        {/* Spatial Cards */}
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[2/3] glass-pane !rounded-2xl hover-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <h4 className="font-bold text-xl mb-1 group-hover:-translate-y-2 transition-transform">Movie {i}</h4>
                <p className="text-white/50 text-sm opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all">2024 • Action</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
