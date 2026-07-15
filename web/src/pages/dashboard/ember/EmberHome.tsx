import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeatured, getMovies } from '../../../api/movies';
import { getPlaybackSessions } from '../../../api/playback';
import { useProfileStore } from '../../../stores/profileStore';
import { Movie, PlaybackSession } from '../../../types/api';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { MediaRow } from '../../../components/media/MediaRow';
import { EmberBackground } from '../../../themes/ember/EmberBackground';

export function EmberHome() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sessions, setSessions] = useState<PlaybackSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [feat, movs, sess] = await Promise.all([
          getFeatured(),
          getMovies(),
          activeProfile ? getPlaybackSessions(activeProfile.id) : Promise.resolve([])
        ]);
        if (mounted) {
          setFeatured(feat);
          setMovies(movs);
          setSessions(sess);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [activeProfile]);

  const handleSelectMovie = (movie: Movie) => {
    navigate(`/watch/${movie.id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] tracking-widest uppercase">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      {/* Hero Billboard */}
      {featured && (
        <div className="w-full h-[70vh] relative overflow-hidden">
          <img 
            src={featured.backdrop_url || featured.poster_url || ''} 
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <EmberBackground />
          </div>
          <div 
            className="absolute bottom-0 left-0 w-full h-[40%]"
            style={{ background: 'linear-gradient(to top, var(--bg-body) 0%, transparent 100%)' }}
          />
          
          <div className="absolute left-[var(--spacing-margin-desktop)] bottom-[20%] z-10 max-w-2xl">
            <GlassPane className="p-[var(--spacing-glass-padding)] flex flex-col items-start gap-4" spotlight={false}>
              <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--text-accent)] uppercase">
                [ NOW STREAMING ]
              </div>
              <h1 className="font-[family-name:var(--font-headline)] text-[var(--text-primary)] text-5xl md:text-[64px] leading-tight font-bold drop-shadow-lg">
                {featured.title}
              </h1>
              {featured.plot && (
                <p className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] text-sm md:text-base line-clamp-3 max-w-xl">
                  {featured.plot}
                </p>
              )}
              <div className="mt-4 flex gap-4">
                <Button variant="primary" onClick={() => handleSelectMovie(featured)}>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  INITIALIZE PLAYBACK
                </Button>
                <Button variant="secondary">
                  DETAILS
                </Button>
              </div>
            </GlassPane>
          </div>
        </div>
      )}

      {/* Catalog Rows */}
      <div className="mt-8 flex flex-col gap-12">
        {sessions.length > 0 && (
          <MediaRow 
            title="Continue Watching" 
            items={sessions.map(s => movies.find(m => m.id === s.movie_id)).filter(Boolean) as Movie[]}
            playbackSessions={sessions}
            onSelect={handleSelectMovie}
          />
        )}
        
        <MediaRow 
          title="Recently Added Movies" 
          items={movies.slice(0, 15)} 
          playbackSessions={sessions}
          onSelect={handleSelectMovie}
        />
        
        {/* Placeholder for Series, reusing movies array since series endpoint isn't fully separated here yet */}
        <MediaRow 
          title="Recently Added Series" 
          items={movies.slice(0, 10).reverse()} 
          playbackSessions={sessions}
          onSelect={handleSelectMovie}
        />
      </div>
    </div>
  );
}
