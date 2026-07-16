import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MOTION_EASE, MOTION_TIMINGS, useAppMotion } from "../../motion/motionSystem";
import { cn } from "../../utils/cn";
import { serverArtworkCandidates, type ArtworkEpisodeIdentity, type ArtworkMediaIdentity } from "../../utils/media";

interface MediaArtworkProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  media?: ArtworkMediaIdentity;
  episode?: ArtworkEpisodeIdentity;
}

const artworkResolutionCache = new Map<string, Promise<string | null>>();

export function clearArtworkResolutionCache(): void {
  artworkResolutionCache.clear();
}

export function resolveArtworkCandidates(candidates: string[]): Promise<string | null> {
  const key = candidates.join("\n");
  const cached = artworkResolutionCache.get(key);
  if (cached) return cached;
  const resolution = (async () => {
    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { headers: { Range: "bytes=0-0" }, cache: "force-cache" });
        if (!response.ok) continue;
        await response.body?.cancel().catch(() => undefined);
        return candidate;
      } catch {
        // Missing or temporarily unreachable candidates fall through to the next server path.
      }
    }
    return null;
  })();
  artworkResolutionCache.set(key, resolution);
  return resolution;
}

export function MediaArtwork({ src, alt, className, media, episode }: MediaArtworkProps) {
  const candidates = useMemo(
    () => serverArtworkCandidates(src, media, episode),
    [episode?.episodeNumber, episode?.seasonNumber, media?.id, media?.releaseYear, media?.title, media?.type, src],
  );
  const candidateKey = candidates.join("\n");
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState<string | null | undefined>(() => candidates.length > 1 ? undefined : candidates[0] ?? null);
  const [loaded, setLoaded] = useState(false);
  const { reduced } = useAppMotion();

  useEffect(() => {
    let active = true;
    setCandidateIndex(0);
    setLoaded(false);
    if (candidates.length <= 1) {
      setResolvedSrc(candidates[0] ?? null);
      return () => { active = false; };
    }
    setResolvedSrc(undefined);
    void resolveArtworkCandidates(candidates).then((candidate) => { if (active) setResolvedSrc(candidate); });
    return () => { active = false; };
  }, [candidateKey]);

  const selectedSrc = candidates.length > 1 ? resolvedSrc : candidates[candidateIndex] ?? null;

  if (selectedSrc === undefined) {
    return <div role="status" aria-label={`${alt} artwork loading`} className={cn("media-artwork-loading bg-[var(--bg-surface-container)]", className)} />;
  }

  if (!selectedSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt} artwork unavailable`}
        className={cn("grid place-items-center bg-[var(--bg-surface-container)] text-[var(--text-muted)]", className)}
      >
        <span className="px-4 text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider">
          Artwork unavailable
        </span>
      </div>
    );
  }

  return <motion.img
    key={selectedSrc}
    src={selectedSrc}
    alt={alt}
    className={className}
    initial={{ opacity: 0, scale: reduced ? 1 : 1.018, filter: reduced ? "none" : "blur(7px)" }}
    animate={{ opacity: loaded ? 1 : 0, scale: 1, filter: "blur(0px)" }}
    transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.artwork, ease: MOTION_EASE }}
    onLoad={() => setLoaded(true)}
    onError={() => {
      setLoaded(false);
      if (candidates.length > 1) {
        artworkResolutionCache.delete(candidateKey);
        setResolvedSrc(null);
      } else setCandidateIndex((index) => index + 1);
    }}
  />;
}
