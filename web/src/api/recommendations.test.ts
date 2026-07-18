import { afterEach, describe, expect, it, vi } from "vitest";
import { getRecommendations } from "./recommendations";

afterEach(() => vi.unstubAllGlobals());

describe("recommendation API", () => {
  it("requests an encoded scoped page and preserves item and Watch Again order", async () => {
    const signal = new AbortController().signal;
    const response = {
      profileId: "profile one", scope: "movies", category: "Science Fiction", generatedAt: 10,
      stale: false, total: 2, offset: 0, limit: 48,
      categories: [{ value: "recommended", label: "Recommended", affinity: 0, serverCount: 1, cachedCount: 1 }],
      items: [
        { media: { id: "first", title: "First", type: "movie" }, source: "tmdb_cache", availability: "cached", score: 2, reasons: ["First reason"] },
        { media: { id: "second", title: "Second", type: "movie" }, source: "server", availability: "available", score: 99, reasons: [] },
      ],
      watchAgain: [
        { media: { id: "recent", title: "Recent", type: "movie" }, source: "server", availability: "available", score: 1, reasons: ["ignored"] },
        { media: { id: "older", title: "Older", type: "movie" }, source: "server", availability: "available", score: 100, reasons: [] },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await getRecommendations({ profileId: "profile one", scope: "movies", category: "Science Fiction", signal });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/recommendations/profile%20one?scope=movies&category=Science+Fiction&limit=48&offset=0");
    expect(fetchMock.mock.calls[0][1].signal).toBe(signal);
    expect(result.items.map((entry) => entry.media.id)).toEqual(["first", "second"]);
    expect(result.watchAgain.map((entry) => entry.media.id)).toEqual(["recent", "older"]);
    expect(result.items[0].media).toMatchObject({ source: "tmdb_cache", availability: "cached", recommendationScore: 2, recommendationReasons: ["First reason"] });
  });

  it("normalizes snake-case fields and malformed optional collections", async () => {
    const response = { profile_id: "1", scope: "home", category: "recommended", generated_at: 5, total: 0, offset: 0, limit: 48, categories: [{ value: "Drama", label: "Drama", server_count: 2, cached_count: 3 }], items: null, watch_again: null };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status: 200 })));
    const result = await getRecommendations({ profileId: "1", scope: "home" });
    expect(result.categories[0]).toMatchObject({ serverCount: 2, cachedCount: 3 });
    expect(result.items).toEqual([]);
    expect(result.watchAgain).toEqual([]);
  });
});
