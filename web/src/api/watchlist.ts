import { apiGet, apiPost } from "./client";
import type { WatchlistToggleResponse } from "../types/api";

export const getWatchlist = (profileId: string) => apiGet<string[]>(`/api/watchlist/${profileId}`);
export const toggleWatchlist = (profileId: string, movieId: string) => apiPost<WatchlistToggleResponse>("/api/watchlist/toggle", { profile_id: profileId, movie_id: movieId });
