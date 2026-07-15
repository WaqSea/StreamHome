import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { EmberDetails } from './EmberDetails';
import { AuroraDetails } from './AuroraDetails';
import { CinemaDetails } from './CinemaDetails';
import { GeminiDetails } from './GeminiDetails';
import { getMovie } from '../../api/movies';
import { Movie } from '../../types/api';

interface DetailsRouterProps {
  movieId: string;
  onClose: () => void;
}

export function DetailsRouter({ movieId, onClose }: DetailsRouterProps) {
  const { activeTheme } = useThemeStore();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    let mounted = true;
    getMovie(movieId).then(data => {
      if (mounted) setMovie(data);
    }).catch(err => {
      console.error(err);
      if (mounted) onClose();
    });
    return () => { mounted = false; };
  }, [movieId, onClose]);

  if (!movie) return null;

  switch (activeTheme) {
    case 'aurora':
      return <AuroraDetails movie={movie} onClose={onClose} />;
    case 'cinema':
      return <CinemaDetails movie={movie} onClose={onClose} />;
    case 'gemini':
      return <GeminiDetails movie={movie} onClose={onClose} />;
    case 'ember':
    default:
      return <EmberDetails movie={movie} onClose={onClose} />;
  }
}
