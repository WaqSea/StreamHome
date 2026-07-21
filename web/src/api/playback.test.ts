import { afterEach, describe, expect, it, vi } from "vitest";
import { createPlaybackRun, trackPlayback, updatePlaybackProgress } from "./playback";

afterEach(() => vi.unstubAllGlobals());

describe("playback tracking", () => {
  it("sends the exact field names expected by the existing server", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "success", updatedAt: "now" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await trackPlayback({ movieId: "tv_1", profileId: "1", episodeId: "ep_1_s1_e1", timestamp: 30, durationWatched: 30, completionRate: 0.5, isFinished: false });
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({ movieId: "tv_1", profileId: "1", timestamp: 30, duration_watched: 30, completion_rate: 0.5, episodeId: "ep_1_s1_e1", is_finished: false });
  });

  it("creates authenticated playback runs with canonical movie, profile, and episode fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ runId: "run-1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await createPlaybackRun("tv_1", "profile-1", "ep_1_s1_e1");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/playback/runs");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({
      movie_id: "tv_1",
      profile_id: "profile-1",
      episode_id: "ep_1_s1_e1",
    });
  });

  it("sends sequenced event progress with keepalive for final lifecycle updates", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok", nextSequenceNumber: 8 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await updatePlaybackProgress("run-1", {
      timestamp: 91.5,
      durationWatched: 9,
      isFinished: false,
      sequenceNumber: 7,
      event: "visibility",
    }, true);
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(request.keepalive).toBe(true);
    expect(JSON.parse(String(request.body))).toEqual({
      timestamp: 91.5,
      duration_watched: 9,
      is_finished: false,
      sequence_number: 7,
      event: "visibility",
    });
  });
});
