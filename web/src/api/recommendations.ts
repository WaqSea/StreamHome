import { apiGet } from "./client";
import { normalizeMovie } from "./movies";
import type { RecommendationCategory, RecommendationFeed, RecommendationItem } from "../types/api";
import type { CatalogView } from "../navigation/queryState";

type RawRecommendationCategory = Partial<RecommendationCategory> & {
  server_count?: number;
  cached_count?: number;
};

type RawRecommendationItem = Partial<RecommendationItem> & {
  media?: Parameters<typeof normalizeMovie>[0];
};

type RawRecommendationFeed = Partial<Omit<RecommendationFeed, "categories" | "items" | "watchAgain">> & {
  profile_id?: string;
  generated_at?: number;
  categories?: RawRecommendationCategory[];
  items?: RawRecommendationItem[];
  watchAgain?: RawRecommendationItem[];
  watch_again?: RawRecommendationItem[];
};

export interface RecommendationRequest {
  profileId: string;
  scope: CatalogView;
  category?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}

function normalizeCategory(raw: RawRecommendationCategory): RecommendationCategory {
  return {
    value: raw.value ?? "",
    label: raw.label ?? raw.value ?? "",
    affinity: raw.affinity ?? 0,
    serverCount: raw.serverCount ?? raw.server_count ?? 0,
    cachedCount: raw.cachedCount ?? raw.cached_count ?? 0,
  };
}

function normalizeItem(raw: RawRecommendationItem): RecommendationItem {
  const source = raw.source ?? "tmdb_cache";
  const availability = raw.availability ?? "cached";
  const reasons = Array.isArray(raw.reasons) ? raw.reasons : [];
  const media = normalizeMovie(raw.media ?? {});
  media.source = source;
  media.availability = availability;
  media.recommendationScore = raw.score ?? 0;
  media.recommendationReasons = reasons;
  return { media, source, availability, score: raw.score ?? 0, reasons };
}

export async function getRecommendations({
  profileId,
  scope,
  category = "recommended",
  limit = 48,
  offset = 0,
  signal,
}: RecommendationRequest): Promise<RecommendationFeed> {
  const params = new URLSearchParams({ scope, category, limit: String(limit), offset: String(offset) });
  const raw = await apiGet<RawRecommendationFeed>(`/api/recommendations/${encodeURIComponent(profileId)}?${params.toString()}`, { signal });
  const watchAgain = raw.watchAgain ?? raw.watch_again;
  return {
    profileId: raw.profileId ?? raw.profile_id ?? profileId,
    scope: raw.scope === "movies" || raw.scope === "series" ? raw.scope : "home",
    category: raw.category ?? category,
    generatedAt: raw.generatedAt ?? raw.generated_at ?? 0,
    stale: raw.stale ?? false,
    total: raw.total ?? 0,
    offset: raw.offset ?? offset,
    limit: raw.limit ?? limit,
    categories: Array.isArray(raw.categories) ? raw.categories.map(normalizeCategory).filter((item) => item.value) : [],
    items: Array.isArray(raw.items) ? raw.items.map(normalizeItem).filter((item) => item.media.id) : [],
    watchAgain: Array.isArray(watchAgain) ? watchAgain.map(normalizeItem).filter((item) => item.media.id) : [],
  };
}
