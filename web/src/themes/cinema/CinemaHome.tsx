import React from 'react';

export default function CinemaHome({ tab }: { tab: string }) {
  return (
    <div className="w-full min-h-screen text-white font-sans bg-[var(--bg-color)]">
      {/* Solid Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-50 flex items-center px-12 gap-12 transition-colors duration-300">
        <div className="text-3xl font-heading text-[var(--accent-color)]">STREAMHOME</div>
        <div className="flex gap-6 font-bold text-sm">
          <a href="/" className={tab === 'home' ? 'text-white font-bold' : 'text-gray-300 hover:text-gray-400'}>Home</a>
          <a href="/movies" className={tab === 'movies' ? 'text-white font-bold' : 'text-gray-300 hover:text-gray-400'}>Movies</a>
          <a href="/series" className={tab === 'series' ? 'text-white font-bold' : 'text-gray-300 hover:text-gray-400'}>Series</a>
        </div>
      </nav>

      {/* Auto-playing Trailer Hero */}
      <div className="w-full h-[85vh] relative mb-8">
        <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-color)] via-transparent to-transparent" />
        
        <div className="absolute bottom-[20%] left-12 max-w-xl z-20">
          <h2 className="text-7xl font-heading mb-4 text-white drop-shadow-2xl">FIGHT CLUB</h2>
          <p className="text-lg text-white mb-6 drop-shadow-md">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.</p>
          <div className="flex gap-4">
            <button className="bg-white text-black px-8 py-2 rounded font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <span className="text-xl">▶</span> Play
            </button>
            <button className="bg-gray-500/50 text-white px-8 py-2 rounded font-bold text-lg hover:bg-gray-500/70 transition-colors flex items-center gap-2">
              <span className="text-xl">ⓘ</span> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Pop-out Zoom Cards */}
      <div className="px-12 -mt-16 relative z-30">
        <h3 className="font-bold text-xl mb-4 text-gray-300">Trending Now</h3>
        <div className="flex gap-2 overflow-x-visible pb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="min-w-[200px] aspect-[16/9] bg-gray-800 rounded relative cursor-pointer transition-transform duration-300 hover:scale-125 hover:z-50 shadow-lg group">
               <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/w500/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover bg-center rounded group-hover:rounded-b-none transition-all" />
               <div className="absolute top-full left-0 right-0 bg-[var(--bg-color)] p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl rounded-b pointer-events-none">
                 <div className="flex gap-2 mb-2">
                   <button className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-white text-black text-xs">▶</button>
                   <button className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-white text-xs">+</button>
                 </div>
                 <p className="font-bold text-sm text-green-500">98% Match</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
