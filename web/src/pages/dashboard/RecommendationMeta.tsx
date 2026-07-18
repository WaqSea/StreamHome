import React from "react";
import type { Movie } from "../../types/api";
import { mediaAvailability } from "../../utils/media";

export function AvailabilityBadge({ movie, variant = "shared" }: { movie: Movie; variant?: "shared" | "ember" }) {
  const availability = mediaAvailability(movie);
  const label = availability === "available" ? "Available" : availability === "processing" ? "Processing" : "Cached suggestion";
  const prefix = variant === "ember" ? availability === "cached" ? "CACHE" : "SERVER" : movie.source === "tmdb_cache" ? "Cache" : "Server";
  return <span className={`media-availability media-availability--${variant}`} data-availability={availability}><i aria-hidden="true" /><span>{prefix} / {label}</span></span>;
}

export function RecommendationReason({ movie }: { movie: Movie }) {
  const reason = movie.recommendationReasons?.[0];
  return reason ? <span className="recommendation-reason">{reason}</span> : null;
}
