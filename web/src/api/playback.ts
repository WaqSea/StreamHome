import { apiGet, apiPost } from "./client";
import type { PlaybackSession, TrackPlaybackRequest } from "../types/api";

export const getPlaybackSessions = (profileId: string) => apiGet<PlaybackSession[]>(`/api/track/${profileId}`);
export const trackPlayback = (data: TrackPlaybackRequest) => apiPost<{ status: string; updatedAt: string }>("/api/track", data);
