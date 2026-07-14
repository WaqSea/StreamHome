import React from 'react';

export default function GeminiHome({ tab }: { tab: string }) {
  return (
    <div className="w-full min-h-screen text-white font-sans flex bg-[var(--bg-color)]">
      {/* Side Drawer Nav */}
      <nav className="w-64 border-r border-white/5 h-screen sticky top-0 flex flex-col p-8 z-50">
        <div className="text-3xl font-heading font-extrabold mb-16 tracking-tighter">
          STREAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-dark)]">HOME</span>
        </div>
        
        <div className="flex flex-col gap-6 text-lg font-medium text-white/50">
          <a href="/" className={`hover:text-white transition-colors ${tab === 'home' ? 'text-white' : ''}`}>Home</a>
          <a href="/movies" className={`hover:text-white transition-colors ${tab === 'movies' ? 'text-white' : ''}`}>Movies</a>
          <a href="/series" className={`hover:text-white transition-colors ${tab === 'series' ? 'text-white' : ''}`}>Series</a>
          <a href="/downloads" className={`hover:text-white transition-colors ${tab === 'downloads' ? 'text-white' : ''}`}>Downloads</a>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-12">
        
        {/* Search Bar Placeholder */}
        <div className="w-full max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-dark)] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <input 
            type="text" 
            placeholder="Ask or search for anything..." 
            className="relative w-full bg-black border border-white/10 rounded-full px-8 py-4 text-white outline-none focus:border-white/30"
          />
        </div>

        {/* Masonry Grid (Simulated with columns) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          
          {/* Featured Large Item */}
          <div className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer hover-glow p-[1px] bg-gradient-to-b from-white/10 to-transparent">
            <div className="bg-black rounded-[23px] overflow-hidden h-full">
              <div className="aspect-[4/5] relative">
                <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8OQ3NuKc.jpg')] bg-cover bg-center opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-heading font-bold mb-2">Fight Club</h3>
                  <p className="text-white/60 line-clamp-2">A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression...</p>
                </div>
              </div>
            </div>
          </div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer hover-glow p-[1px] bg-gradient-to-b from-white/10 to-transparent">
               <div className="bg-black rounded-[23px] overflow-hidden h-full">
                 <div className={`aspect-[${i % 2 === 0 ? '16/9' : '3/4'}] relative`}>
                   <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full font-bold">Play</span>
                   </div>
                   <div className="absolute bottom-4 left-4 font-heading font-bold">Media {i}</div>
                 </div>
               </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
