import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearArtworkResolutionCache, MediaArtwork, resolveArtworkCandidates } from "./MediaArtwork";

describe("MediaArtwork", () => {
  beforeEach(() => {
    clearArtworkResolutionCache();
    vi.restoreAllMocks();
  });

  it("does not request a web-local fallback asset", () => {
    render(<MediaArtwork src="/poster.jpg" alt="Example" />);
    expect(screen.getByLabelText("Example artwork unavailable")).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Example" })).toBeNull();
  });

  it("probes generated server artwork before mounting the valid image", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => ({ ok: String(input).includes("2025"), body: null }) as Response);
    vi.stubGlobal("fetch", fetchMock);
    const media = { id: "m_1280738", title: "The Furious", type: "movie" as const, releaseYear: 2026 };
    render(<MediaArtwork src="/poster.jpg" alt="The Furious" media={media} />);
    expect(screen.getByRole("status", { name: "The Furious artwork loading" })).toBeTruthy();
    const image = await screen.findByRole("img", { name: "The Furious" });
    expect(image.getAttribute("src")).toBe("/media/Movies/The%20Furious_2025_TMDB_1280738/poster.jpg");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shares one generated-path probe across duplicate artwork instances", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => ({ ok: String(input).includes("2025"), body: null }) as Response);
    vi.stubGlobal("fetch", fetchMock);
    const media = { id: "m_1280738", title: "The Furious", type: "movie" as const, releaseYear: 2026 };
    render(<><MediaArtwork src="/poster.jpg" alt="First" media={media} /><MediaArtwork src="/poster.jpg" alt="Second" media={media} /></>);
    await screen.findByRole("img", { name: "First" });
    await screen.findByRole("img", { name: "Second" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back when a server image fails", () => {
    render(<MediaArtwork src="/media/Movies/example/poster.jpg" alt="Example" />);
    fireEvent.error(screen.getByRole("img", { name: "Example" }));
    expect(screen.getByLabelText("Example artwork unavailable")).toBeTruthy();
  });

  it("shows the TMDB fallback immediately and switches to local artwork when caching finishes", async () => {
    vi.useFakeTimers();
    let localReady = false;
    const fetchMock = vi.fn(async () => ({ ok: localReady, body: null }) as Response);
    vi.stubGlobal("fetch", fetchMock);
    const media = {
      id: "m_42", title: "Cached title", type: "movie" as const, releaseYear: 2024,
      localThumbnailUrl: "/media/Movies/Cached%20title_2024_TMDB_42/poster.jpg",
      remoteThumbnailUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
      cacheState: "queued" as const,
    };
    render(<MediaArtwork src={media.remoteThumbnailUrl} alt="Cached title" media={media} />);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByRole("img", { name: "Cached title" }).getAttribute("src")).toBe(media.remoteThumbnailUrl);
    localReady = true;
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(screen.getByRole("img", { name: "Cached title" }).getAttribute("src")).toBe(media.localThumbnailUrl);
    vi.useRealTimers();
  });

  it("skips an image that fails after probing and renders the TMDB fallback", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, body: null }) as Response));
    const media = {
      id: "m_42", title: "Fallback title", type: "movie" as const, releaseYear: 2024,
      localThumbnailUrl: "/media/Movies/Fallback%20title_2024_TMDB_42/poster.jpg",
      remoteThumbnailUrl: "https://image.tmdb.org/t/p/w500/fallback.jpg",
      cacheState: "queued" as const,
    };
    render(<MediaArtwork src={media.remoteThumbnailUrl} alt="Fallback title" media={media} />);
    const localImage = await screen.findByRole("img", { name: "Fallback title" });
    expect(localImage.getAttribute("src")).toBe(media.localThumbnailUrl);
    fireEvent.error(localImage);
    await waitFor(() => expect(screen.getByRole("img", { name: "Fallback title" }).getAttribute("src")).toBe(media.remoteThumbnailUrl));
  });

  it("does not preserve a null resolution in the shared cache", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, body: null }) as Response);
    vi.stubGlobal("fetch", fetchMock);
    const candidates = ["/media/Movies/missing/poster.jpg", "/media/Movies/also-missing/poster.jpg"];
    expect(await resolveArtworkCandidates(candidates)).toBeNull();
    expect(await resolveArtworkCandidates(candidates)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("restores visibility when a cached image is already complete after remount", async () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(500);
    const source = "https://image.tmdb.org/t/p/w500/cached.jpg";
    const first = render(<MediaArtwork src={source} alt="Cached artwork" />);
    await waitFor(() => expect(screen.getByRole("img", { name: "Cached artwork" }).getAttribute("data-loaded")).toBe("true"));
    first.unmount();
    render(<MediaArtwork src={source} alt="Cached artwork" />);
    await waitFor(() => expect(screen.getByRole("img", { name: "Cached artwork" }).getAttribute("data-loaded")).toBe("true"));
  });
});
