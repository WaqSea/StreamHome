import React, { useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { serverArtworkCandidates, type ArtworkEpisodeIdentity, type ArtworkMediaIdentity } from "../../utils/media";

interface MediaArtworkProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  media?: ArtworkMediaIdentity;
  episode?: ArtworkEpisodeIdentity;
}

export function MediaArtwork({ src, alt, className, media, episode }: MediaArtworkProps) {
  const candidates = useMemo(
    () => serverArtworkCandidates(src, media, episode),
    [episode?.episodeNumber, episode?.seasonNumber, media?.id, media?.releaseYear, media?.title, media?.type, src],
  );
  const candidateKey = candidates.join("\n");
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => setCandidateIndex(0), [candidateKey]);

  if (!candidates[candidateIndex]) {
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

  return <img src={candidates[candidateIndex]} alt={alt} className={className} onError={() => setCandidateIndex((index) => index + 1)} />;
}
