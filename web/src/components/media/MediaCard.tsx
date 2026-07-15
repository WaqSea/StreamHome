import React, { useRef, useState } from 'react';
import { Movie, PlaybackSession } from '../../types/api';
import { ProgressBar } from '../ui/ProgressBar';

interface MediaCardProps {
  movie: Movie;
  playbackSession?: PlaybackSession;
  onSelect?: (movie: Movie) => void;
}

export function MediaCard({ movie, playbackSession, onSelect }: MediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glintTranslate, setGlintTranslate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    
    // Max rotation 15 degrees
    const rotateY = (deltaX / (rect.width / 2)) * 15;
    const rotateX = -(deltaY / (rect.height / 2)) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlintTranslate({ x: deltaX * 0.5, y: deltaY * 0.5 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  let progress = 0;
  if (playbackSession && playbackSession.durationWatched > 0) {
    progress = playbackSession.timestamp / playbackSession.durationWatched;
  }

  return (
    <div
      className="flex-shrink-0 cursor-pointer rounded-[var(--radius)]"
      style={{
        width: '200px',
        aspectRatio: '2/3',
        perspective: '600px',
      }}
      onClick={() => onSelect?.(movie)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative overflow-hidden rounded-[var(--radius)] bg-[var(--glass-fill)]"
        style={{
          border: `1px solid ${isHovered ? 'var(--glass-border-hover)' : 'var(--glass-border)'}`,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? 'none' : 'all var(--duration-medium) var(--easing-smooth)',
          transformStyle: 'preserve-3d',
        }}
      >
        <img 
          src={movie.thumbnailUrl || ''} 
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover rounded-[calc(var(--radius)-1px)] select-none"
        />

        {/* Glint overlay */}
        <div 
          className="absolute inset-[-100%] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
            transform: `translate(${glintTranslate.x}px, ${glintTranslate.y}px)`,
            transition: isHovered ? 'none' : 'opacity var(--duration-fast)',
          }}
        />

        {playbackSession && (
          <div className="absolute bottom-0 left-0 w-full z-10">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>
    </div>
  );
}
