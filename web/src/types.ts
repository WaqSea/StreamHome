export interface Profile {
  id: string;
  name: string;
  avatarColor: string; // Tailwind color class or hex for high-quality minimalist avatars
  theme?: "default" | "netflix" | "prime" | "apple" | "gemini";
  pinEnabled?: boolean;
  pin?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  quality?: string;
  languages?: string[];
  subtitles?: { language: string; ext: string }[];
  skipMarkers?: Record<string, { start_ms: number | null; end_ms: number | null }[]>;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  bannerUrl?: string;
  genres: string[];
  duration: string; // e.g., "1h 45m"
  releaseYear: number;
  rating?: string; // e.g., "PG-13", "R"
  cast?: string[];
  director?: string;
  type?: "movie" | "series";
  quality?: string;
  languages?: string[];
  subtitles?: { language: string; ext: string }[];
  episodes?: Episode[];
  activeEpisodeId?: string;
  activeEpisodeNumber?: number;
  activeSeasonNumber?: number;
  skipMarkers?: Record<string, { start_ms: number | null; end_ms: number | null }[]>;
}

export interface PlaybackSession {
  movieId: string;
  profileId: string;
  timestamp: number; // in seconds
  updatedAt: string;
  episodeId?: string; // Track specific episode for series
  is_finished?: boolean; // Smart recommend filter
}

