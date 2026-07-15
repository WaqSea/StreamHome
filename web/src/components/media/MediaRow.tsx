import React, { useRef, useState } from 'react';
import { Movie, PlaybackSession } from '../../types/api';
import { MediaCard } from './MediaCard';
import { cn } from '../../utils/cn';

interface MediaRowProps {
  title: string;
  items: Movie[];
  playbackSessions?: PlaybackSession[];
  onSelect?: (movie: Movie) => void;
}

export function MediaRow({ title, items, playbackSessions, onSelect }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 200;
    const gap = 16;
    const amount = (cardWidth + gap) * 5;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="relative flex flex-col gap-4 px-[var(--spacing-margin-desktop)] mb-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="font-[family-name:var(--font-headline)] text-[var(--text-primary)] text-2xl font-semibold tracking-wide">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Blade */}
        <div 
          className={cn(
            "absolute left-[-16px] top-0 bottom-0 w-[60px] z-20 flex items-center justify-center cursor-pointer transition-all duration-[var(--duration-fast)]",
            "bg-[var(--glass-fill)] backdrop-blur-[var(--glass-blur)] rounded-r-[var(--radius)]",
            "border border-transparent hover:border-dashed hover:border-[var(--glass-border-hover)] text-[var(--text-muted)] hover:text-[var(--accent-container)]",
            (isHovered && showLeft) ? "opacity-100 translate-x-4" : "opacity-0 pointer-events-none"
          )}
          onClick={() => scrollByAmount('left')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-hidden scroll-smooth py-4 -my-4 px-4 -mx-4 no-scrollbar"
        >
          {items.map(movie => {
            const session = playbackSessions?.find(s => s.movieId === movie.id);
            return (
              <MediaCard 
                key={movie.id} 
                movie={movie} 
                playbackSession={session} 
                onSelect={onSelect}
              />
            );
          })}
        </div>

        {/* Right Blade */}
        <div 
          className={cn(
            "absolute right-[-16px] top-0 bottom-0 w-[60px] z-20 flex items-center justify-center cursor-pointer transition-all duration-[var(--duration-fast)]",
            "bg-[var(--glass-fill)] backdrop-blur-[var(--glass-blur)] rounded-l-[var(--radius)]",
            "border border-transparent hover:border-dashed hover:border-[var(--glass-border-hover)] text-[var(--text-muted)] hover:text-[var(--accent-container)]",
            (isHovered && showRight) ? "opacity-100 -translate-x-4" : "opacity-0 pointer-events-none"
          )}
          onClick={() => scrollByAmount('right')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}
