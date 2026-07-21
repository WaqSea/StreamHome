import { apiGet, apiPost } from "./client";
import type {
  PlaybackProgressRequest,
  PlaybackProgressResponse,
  PlaybackSession,
  TrackPlaybackRequest,
  PlaybackRunResponse,
} from "../types/api";

export const getPlaybackSessions = (profileId: string, signal?: AbortSignal) => apiGet<PlaybackSession[]>(`/api/track/${profileId}`, { signal });

export const trackPlayback = (data: TrackPlaybackRequest) => apiPost<{ status: string; updatedAt: string }>("/api/track", {
  movieId: data.movieId,
  profileId: data.profileId,
  timestamp: data.timestamp,
  duration_watched: data.durationWatched ?? 0,
  completion_rate: data.completionRate ?? 0,
  episodeId: data.episodeId,
  is_finished: data.isFinished ?? false,
});

export const createPlaybackRun = (movieId: string, profileId: string, episodeId?: string, signal?: AbortSignal) =>
  apiPost<PlaybackRunResponse>("/api/playback/runs", {
    movie_id: movieId,
    profile_id: profileId,
    episode_id: episodeId,
  }, { signal });

export const getPlaybackRun = (runId: string, options?: { retry?: boolean; signal?: AbortSignal }) =>
  apiGet<PlaybackRunResponse>(`/api/playback/runs/${runId}${options?.retry ? "?retry=true" : ""}`, { signal: options?.signal });

export const updatePlaybackProgress = (runId: string, progress: PlaybackProgressRequest, keepalive = false) =>
  apiPost<PlaybackProgressResponse>(`/api/playback/runs/${runId}/progress`, {
    timestamp: progress.timestamp,
    duration_watched: progress.durationWatched,
    is_finished: progress.isFinished,
    sequence_number: progress.sequenceNumber,
    event: progress.event,
  }, { keepalive });

export const startOverPlaybackRun = (runId: string) =>
  apiPost<{ status: string }>(`/api/playback/runs/${runId}/start-over`);
