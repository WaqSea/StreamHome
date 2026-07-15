// --- Auth ---
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { accessToken: string; tokenType: string; email: string; }
export interface TwoFARequiredResponse { requires2fa: true; email: string; message: string; }
export type AuthResponse = LoginResponse | TwoFARequiredResponse;
export interface VerifyRequest { email: string; code: string; }
export interface TwoFAStatusResponse { twoFactorEnabled: boolean; email: string; }
export interface TwoFASetupResponse { secret: string; provisioningUri: string; }

// --- Profiles ---
export interface Profile {
  id: string;
  name: string;
  avatarColor: string;     // Tailwind gradient e.g. "from-blue-600 to-indigo-600"
  theme: string | null;    // "ember" | "aurora" | "cinema" | "gemini"
  pinEnabled: boolean;
  pin: string | null;
}
export interface CreateProfileRequest {
  id: string; name: string; avatarColor?: string; theme?: string;
  pinEnabled?: boolean; pin?: string;
}

// --- Movies ---
export interface Movie {
  id: string;              // "m_{tmdb_id}" or "tv_{tmdb_id}"
  title: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string | null;
  videoUrl: string;
  genres: string[];        // deserialized from genres_str
  duration: string;        // "2h 10m"
  releaseYear: number;
  rating: string;          // "PG-13"
  cast: string[];          // deserialized from cast_str
  director: string | null;
  type: "movie" | "series";
  originalLanguage: string | null;
  quality: string;
  languages: string[];
  subtitles: SubtitleInfo[];
  voteAverage: number;
  voteCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skipMarkers: Record<string, any> | null;
  hevcCompressed: boolean;
}
export interface SubtitleInfo { language: string; extension: string; }

// --- Episodes ---
export interface Episode {
  id: string;              // "ep_{tmdb_id}_s{season}_e{episode}"
  movieId: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  quality: string;
  languages: string[];
  subtitles: SubtitleInfo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skipMarkers: Record<string, any> | null;
}

// --- Playback ---
export interface PlaybackSession {
  id: number;
  profileId: string;
  movieId: string;
  episodeId: string | null;
  timestamp: number;       // seconds
  durationWatched: number;
  completionRate: number;  // 0.0–1.0
  updatedAt: string;       // ISO string
  isFinished: boolean;
}
export interface TrackPlaybackRequest {
  movieId: string; profileId: string; timestamp: number;
  durationWatched?: number; completionRate?: number;
  episodeId?: string; isFinished?: boolean;
}

// --- Watchlist ---
export interface WatchlistToggleResponse {
  status: "added" | "removed"; watchlist: string[];
}

// --- System Settings (Admin) ---
export interface SystemSettings {
  storageEngine: "LOCAL" | "CLOUD";
  rcloneRemotePath: string;
  hevcCompressionMode: "auto" | "on" | "off";
}

// --- Downloads ---
export interface DownloadTask {
  id: string;
  tmdbId: number;
  title: string;
  mediaType: "movie" | "tv";
  season: number | null;
  episode: number | null;
  status: "PENDING" | "DOWNLOADING" | "MERGING" | "MOVING_CLOUD" | "COMPLETED" | "FAILED";
  quality: string | null;
  language: string | null;
  errorMessage: string | null;
  createdAt: string;
}

// --- Backup (Admin) ---
export interface BackupEntry {
  filename: string; timestamp: string; size: number;
  formattedSize: string; path: string;
}

// --- Update (Admin) ---
export interface UpdateStatus {
  status: string; updateAvailable: boolean; gitClean: boolean;
  activeBranch: string; systemIdle: boolean;
}

// --- TMDB Discovery ---
export interface DiscoverMovie {
  id: number; title: string; overview: string;
  posterPath: string; backdropPath: string;
  releaseDate: string; voteAverage: number;
  mediaType: string;
}
