import { apiGet, apiPost } from "./client";
import type { WatchlistToggleResponse } from "../types/api";

export const getWatchlist = (profileId: string, signal?: AbortSignal) => apiGet<string[]>(`/api/watchlist/${profileId}`, { signal });
export const toggleWatchlist = (profileId: string, movieId: string) => apiPost<WatchlistToggleResponse>("/api/watchlist/toggle", { profile_id: profileId, movie_id: movieId });
