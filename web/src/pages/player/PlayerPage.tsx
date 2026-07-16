import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { getEpisodes, getMovies } from "../../api/movies";
import { trackPlayback } from "../../api/playback";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import { useThemeStore } from "../../stores/themeStore";
import { appUrl, parseAppQuery } from "../../navigation/queryState";
import { getThemeDefinition } from "../../themes/application/themeRegistry";
import type { Episode, Movie, SubtitleInfo } from "../../types/api";
import { formatDuration } from "../../utils/format";
import { isServerArtworkUrl } from "../../utils/media";
import { MOTION_EASE, MOTION_TIMINGS, useAppMotion } from "../../motion/motionSystem";

const QUALITIES = ["Source", "1080p", "720p", "480p", "360p", "240p"] as const;

interface PlayableAsset {
  id: string;
  movieId: string;
  episodeId?: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  durationLabel: string;
  quality: string;
  languages: string[];
  subtitles: SubtitleInfo[];
  skipMarkers: Record<string, unknown>;
}

interface ResolvedPlayback {
  asset: PlayableAsset;
  episodeSequence: Episode[];
}

function episodeTmdbId(mediaId: string): number | null {
  const match = mediaId.match(/^ep_(\d+)_s\d+_e\d+$/);
  return match ? Number(match[1]) : null;
}

export function nextPlayableEpisode(episodes: Episode[], currentId: string): Episode | null {
  const ordered = [...episodes].sort((left, right) => left.seasonNumber - right.seasonNumber || left.episodeNumber - right.episodeNumber);
  const currentIndex = ordered.findIndex((episode) => episode.id === currentId);
  if (currentIndex < 0) return null;
  return ordered.slice(currentIndex + 1).find((episode) => Boolean(episode.videoUrl)) ?? null;
}

function assetFromMovie(movie: Movie): PlayableAsset {
  return {
    id: movie.id,
    movieId: movie.id,
    title: movie.title,
    subtitle: "",
    videoUrl: movie.videoUrl,
    durationLabel: movie.duration,
    quality: movie.quality,
    languages: movie.languages,
    subtitles: movie.subtitles,
    skipMarkers: movie.skipMarkers,
  };
}

function assetFromEpisode(movie: Movie, episode: Episode): PlayableAsset {
  return {
    id: episode.id,
    movieId: movie.id,
    episodeId: episode.id,
    title: movie.title,
    subtitle: `S${episode.seasonNumber} E${episode.episodeNumber} · ${episode.title}`,
    videoUrl: episode.videoUrl,
    durationLabel: episode.duration,
    quality: episode.quality,
    languages: episode.languages,
    subtitles: episode.subtitles,
    skipMarkers: episode.skipMarkers,
  };
}

function activeSkipMarker(markers: Record<string, unknown>, time: number): { label: string; end: number } | null {
  for (const [name, value] of Object.entries(markers)) {
    if (!Array.isArray(value)) continue;
    for (const marker of value) {
      if (!marker || typeof marker !== "object") continue;
      const start = Number((marker as { start?: unknown }).start);
      const end = Number((marker as { end?: unknown }).end);
      if (Number.isFinite(start) && Number.isFinite(end) && time >= start && time < end) {
        return { label: `Skip ${name}`, end };
      }
    }
  }
  return null;
}

export function PlayerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => parseAppQuery(location.search), [location.search]);
  const mediaId = query.media ?? "";
  const token = useAuthStore((state) => state.token);
  const profile = useProfileStore((state) => state.activeProfile)!;
  const theme = useThemeStore((state) => state.activeTheme);
  const definition = getThemeDefinition(theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekTimerRef = useRef<number | null>(null);
  const trackingTimerRef = useRef<number | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const [asset, setAsset] = useState<PlayableAsset | null>(null);
  const [episodeSequence, setEpisodeSequence] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Source");
  const [audioTrack, setAudioTrack] = useState(0);
  const [streamStart, setStreamStart] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [seriesComplete, setSeriesComplete] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const { reduced } = useAppMotion();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setAsset(null);
    setEpisodeSequence([]);
    setCurrentTime(0);
    setDuration(0);
    setStreamStart(0);
    setSeriesComplete(false);
    setBuffering(false);
    const resolveAsset = async () => {
      const catalog = await getMovies();
      if (mediaId.startsWith("m_")) {
        const movie = catalog.find((item) => item.id === mediaId);
        if (!movie) throw new Error("This movie is not present in the server catalog.");
        return { asset: assetFromMovie(movie), episodeSequence: [] } satisfies ResolvedPlayback;
      }
      if (mediaId.startsWith("tv_")) throw new Error("Choose a playable episode before opening the player.");
      if (mediaId.startsWith("ep_")) {
        for (const movie of catalog.filter((item) => item.type === "series")) {
          const embedded = movie.episodes?.find((episode) => episode.id === mediaId);
          if (embedded) {
            const tmdbId = episodeTmdbId(mediaId);
            const sequence = tmdbId === null ? movie.episodes ?? [embedded] : await getEpisodes(tmdbId).catch(() => movie.episodes ?? [embedded]);
            const resolvedEpisode = sequence.find((episode) => episode.id === mediaId) ?? embedded;
            return { asset: assetFromEpisode(movie, resolvedEpisode), episodeSequence: sequence } satisfies ResolvedPlayback;
          }
        }
        const tmdbId = episodeTmdbId(mediaId);
        if (tmdbId !== null) {
          const movie = catalog.find((item) => item.id === `tv_${tmdbId}`);
          if (movie) {
            const episodes = await getEpisodes(tmdbId);
            const episode = episodes.find((item) => item.id === mediaId);
            if (episode) return { asset: assetFromEpisode(movie, episode), episodeSequence: episodes } satisfies ResolvedPlayback;
          }
        }
      }
      throw new Error("This media item is not present in the server catalog.");
    };

    resolveAsset()
      .then((resolved) => {
        if (!active) return;
        if (!resolved.asset.videoUrl) throw new Error("The server did not provide a playable media file.");
        setAsset(resolved.asset);
        setEpisodeSequence(resolved.episodeSequence);
        setAudioTrack((track) => Math.min(track, Math.max(0, resolved.asset.languages.length - 1)));
      })
      .catch((requestError: unknown) => { if (active) setError(requestError instanceof Error ? requestError.message : "Playback could not be initialized."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [mediaId]);

  const videoSrc = useMemo(() => asset && token ? `/api/stream/${encodeURIComponent(asset.id)}?quality=${encodeURIComponent(quality)}&audio_track=${audioTrack}&start=${Math.max(0, streamStart)}&token=${encodeURIComponent(token)}` : "", [asset, token, quality, audioTrack, streamStart]);
  const skipMarker = asset ? activeSkipMarker(asset.skipMarkers, currentTime) : null;
  const nextEpisode = asset?.episodeId ? nextPlayableEpisode(episodeSequence, asset.episodeId) : null;

  const safePlay = useCallback(() => {
    void videoRef.current?.play().catch(() => setError("The browser could not start playback."));
  }, []);

  const seek = useCallback((nextTime: number) => {
    const bounded = Math.min(Math.max(nextTime, 0), duration || nextTime);
    setCurrentTime(bounded);
    if (seekTimerRef.current) window.clearTimeout(seekTimerRef.current);
    seekTimerRef.current = window.setTimeout(() => {
      if (videoRef.current) videoRef.current.currentTime = bounded;
      seekTimerRef.current = null;
    }, 250);
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    const operation = document.fullscreenElement
      ? document.exitFullscreen()
      : containerRef.current?.requestFullscreen();
    if (operation) void operation.catch(() => undefined);
  }, []);

  const exitPlayer = useCallback(() => {
    if ((location.state as { fromApp?: boolean } | null)?.fromApp) navigate(-1);
    else navigate(appUrl(profile.id, "home"), { replace: true });
  }, [location.state, navigate, profile.id]);

  const reportProgress = useCallback((finished = false) => {
    if (!asset || !profile) return;
    const watched = videoRef.current?.currentTime ?? currentTime;
    const total = videoRef.current?.duration || duration;
    void trackPlayback({
      movieId: asset.movieId,
      profileId: profile.id,
      episodeId: asset.episodeId,
      timestamp: Math.floor(watched),
      durationWatched: Math.floor(watched),
      completionRate: total > 0 ? Math.min(watched / total, 1) : 0,
      isFinished: finished,
    }).catch(() => undefined);
  }, [asset, currentTime, duration, profile]);

  const finishPlayback = useCallback(() => {
    setIsPlaying(false);
    reportProgress(true);
    if (nextEpisode) {
      setCurrentTime(0);
      setDuration(0);
      setStreamStart(0);
      navigate(appUrl(profile.id, "watch", { media: nextEpisode.id }), { replace: true, state: location.state });
      return;
    }
    if (asset?.episodeId) setSeriesComplete(true);
  }, [asset?.episodeId, location.state, navigate, nextEpisode, profile.id, reportProgress]);

  const replay = useCallback(() => {
    setSeriesComplete(false);
    setCurrentTime(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
    safePlay();
  }, [safePlay]);

  useEffect(() => {
    if (!asset) return;
    trackingTimerRef.current = window.setInterval(() => reportProgress(false), 10_000);
    return () => {
      if (trackingTimerRef.current) window.clearInterval(trackingTimerRef.current);
      reportProgress(false);
    };
  }, [asset, reportProgress]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === " ") { event.preventDefault(); isPlaying ? videoRef.current?.pause() : safePlay(); }
      if (event.key === "ArrowLeft") seek(currentTime - 10);
      if (event.key === "ArrowRight") seek(currentTime + 10);
      if (event.key.toLowerCase() === "m" && videoRef.current) videoRef.current.muted = !videoRef.current.muted;
      if (event.key.toLowerCase() === "f") toggleFullscreen();
      if (event.key === "Escape" && !document.fullscreenElement) exitPlayer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentTime, exitPlayer, isPlaying, safePlay, seek, toggleFullscreen]);

  const revealControls = useCallback(() => {
      setShowControls(true);
      if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
      if (isPlaying) controlsTimerRef.current = window.setTimeout(() => setShowControls(false), 3000);
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener("mousemove", revealControls);
    window.addEventListener("touchstart", revealControls, { passive: true });
    revealControls();
    return () => {
      window.removeEventListener("mousemove", revealControls);
      window.removeEventListener("touchstart", revealControls);
      if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
    };
  }, [revealControls]);

  const changeStream = (nextQuality: (typeof QUALITIES)[number], nextAudio = audioTrack) => {
    setStreamStart(videoRef.current?.currentTime ?? currentTime);
    setQuality(nextQuality);
    setAudioTrack(nextAudio);
  };

  if (loading) return <motion.div className="grid min-h-screen place-items-center bg-black text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.span animate={reduced ? undefined : { opacity: [.45, 1, .45] }} transition={{ duration: 1.4, repeat: Infinity }}>Loading media from the server…</motion.span></motion.div>;
  if (error || !asset) return <motion.div className="grid min-h-screen place-items-center bg-black p-6 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><motion.div className="max-w-lg text-center" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.dialogEnter, ease: MOTION_EASE }}><h1 className="text-2xl font-semibold">Playback unavailable</h1><p className="mt-3 text-white/60">{error}</p><Button className="mt-6" onClick={exitPlayer}>Go back</Button></motion.div></motion.div>;

  const usableSubtitles = asset.subtitles.filter((subtitle) => isServerArtworkUrl(subtitle.url ?? subtitle.path));

  return (
    <motion.div ref={containerRef} className="player-view fixed inset-0 z-[200] bg-black text-white" data-theme={theme} data-player-theme={definition.playerVariant} onClick={revealControls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.viewEnter }}>
      <video
        ref={videoRef}
        src={videoSrc}
        className="h-full w-full object-contain"
        autoPlay
        onPlay={() => { setIsPlaying(true); setBuffering(false); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onTimeUpdate={() => { if (!seekTimerRef.current) setCurrentTime(videoRef.current?.currentTime ?? 0); }}
        onDurationChange={() => setDuration(Number.isFinite(videoRef.current?.duration) ? (videoRef.current?.duration ?? 0) : 0)}
        onLoadedMetadata={() => { if (streamStart > 0 && videoRef.current) videoRef.current.currentTime = streamStart; safePlay(); }}
        onVolumeChange={() => { setVolume(videoRef.current?.volume ?? 1); setMuted(videoRef.current?.muted ?? false); }}
        onEnded={finishPlayback}
        onError={() => setError("The server stream could not be played.")}
      >
        {usableSubtitles.map((subtitle) => <track key={`${subtitle.language}-${subtitle.url ?? subtitle.path}`} kind="subtitles" src={subtitle.url ?? subtitle.path} srcLang={subtitle.language} label={subtitle.language.toUpperCase()} />)}
      </video>

      <AnimatePresence>{buffering && <motion.div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: MOTION_TIMINGS.notice }}><motion.i className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white" animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: .8, repeat: Infinity, ease: "linear" }} aria-label="Buffering" /></motion.div>}</AnimatePresence>
      <AnimatePresence>{skipMarker && <motion.div className="absolute bottom-32 right-8 z-30" initial={reduced ? { opacity: 0 } : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: MOTION_TIMINGS.notice, ease: MOTION_EASE }}><Button onClick={() => seek(skipMarker.end)}>{skipMarker.label}</Button></motion.div>}</AnimatePresence>
      <AnimatePresence>{seriesComplete && <motion.div className="player-complete-panel" initial={reduced ? { opacity: 0, x: "-50%", y: "-50%" } : { opacity: 0, x: "-50%", y: "calc(-50% + 18px)", scale: .94 }} animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }} exit={{ opacity: 0, x: "-50%", y: "-50%", scale: .97 }} transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.dialogEnter, ease: MOTION_EASE }}><p>EPISODE QUEUE</p><h2>Series complete</h2><span>No later playable episode was returned by the server.</span><div><button onClick={replay}>Replay episode</button><button onClick={exitPlayer}>Back</button></div></motion.div>}</AnimatePresence>

      <AnimatePresence>{(showControls || !isPlaying) && <motion.div className="player-controls absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-6 pt-24 md:px-10" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0, transition: { duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.controlsEnter, ease: MOTION_EASE } }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, transition: { duration: MOTION_TIMINGS.controlsExit, ease: MOTION_EASE } }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-start justify-between gap-5">
            <div><h1 className="text-xl font-semibold md:text-2xl">{asset.title}</h1>{asset.subtitle && <p className="mt-1 text-sm text-white/60">{asset.subtitle}</p>}</div>
            <button onClick={exitPlayer} className="text-sm text-white/70">Exit</button>
          </div>
          <input aria-label="Playback position" type="range" min={0} max={duration || 0} step={0.1} value={Math.min(currentTime, duration || currentTime)} onChange={(event) => seek(Number(event.target.value))} className="w-full accent-[var(--accent-container)]" />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button aria-label={isPlaying ? "Pause" : "Play"} onClick={() => isPlaying ? videoRef.current?.pause() : safePlay()} className="text-lg">{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={() => seek(currentTime - 10)}>−10s</button><button onClick={() => seek(currentTime + 10)}>+10s</button>
            <button onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; }}>{muted ? "Unmute" : "Mute"}</button>
            <input aria-label="Volume" type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={(event) => { const next = Number(event.target.value); if (videoRef.current) { videoRef.current.muted = false; videoRef.current.volume = next; } }} className="w-24 accent-[var(--accent-container)]" />
            <span className="text-sm text-white/60">{formatDuration(currentTime)} / {duration ? formatDuration(duration) : asset.durationLabel}</span>
            <div className="ml-auto flex items-center gap-3">
              {asset.languages.length > 1 && <select aria-label="Audio language" value={audioTrack} onChange={(event) => changeStream(quality, Number(event.target.value))} className="rounded border border-white/20 bg-black px-3 py-2 text-sm">{asset.languages.map((language, index) => <option key={`${language}-${index}`} value={index}>{language.toUpperCase()}</option>)}</select>}
              <select aria-label="Quality" value={quality} onChange={(event) => changeStream(event.target.value as (typeof QUALITIES)[number])} className="rounded border border-white/20 bg-black px-3 py-2 text-sm">{QUALITIES.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <button onClick={toggleFullscreen}>Fullscreen</button>
            </div>
          </div>
        </div>
      </motion.div>}</AnimatePresence>
    </motion.div>
  );
}
