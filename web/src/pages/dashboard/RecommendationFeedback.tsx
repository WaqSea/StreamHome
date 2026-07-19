import React, { createContext, useContext, useState } from "react";
import type { MediaPreference } from "../../types/api";

const OPTIONS: Array<{ value: Exclude<MediaPreference, null>; label: string; direction: "up" | "down"; count: 1 | 2 }> = [
  { value: "like", label: "Like", direction: "up", count: 1 },
  { value: "love", label: "Love", direction: "up", count: 2 },
  { value: "dislike", label: "Dislike", direction: "down", count: 1 },
];

function ThumbIcon({ direction }: { direction: "up" | "down" }) {
  return <svg className="recommendation-feedback__thumb" data-direction={direction} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 10v10H4.8A1.8 1.8 0 0 1 3 18.2v-6.4A1.8 1.8 0 0 1 4.8 10H7Z" /><path d="M7 19.2h9.45a2 2 0 0 0 1.94-1.52l1.45-5.8A1.52 1.52 0 0 0 18.36 10H14l.62-3.1A2.42 2.42 0 0 0 12.25 4h-.45L7 10.15" /></svg>;
}

export interface FeedbackContextValue {
  profileId: string;
  preferences: Record<string, Exclude<MediaPreference, null>>;
  onChange: (movieId: string, preference: MediaPreference) => Promise<void>;
  feedGeneration: string;
  scope: string;
  category: string;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);
export const RecommendationFeedbackProvider = FeedbackContext.Provider;
export function useRecommendationFeedback() { return useContext(FeedbackContext); }

export function RecommendationFeedback({ movieId, preference, onChange, compact = false }: { movieId: string; preference: MediaPreference; onChange: (movieId: string, preference: MediaPreference) => Promise<void>; compact?: boolean }) {
  const [saving, setSaving] = useState(false);
  return <div className={`recommendation-feedback${compact ? " recommendation-feedback--compact" : ""}`} role="group" aria-label="Recommendation feedback">
    {OPTIONS.map((option) => {
      const active = preference === option.value;
      return <button key={option.value} type="button" className={`recommendation-feedback__button recommendation-feedback__button--${option.value}`} aria-label={`${active ? "Remove" : "Set"} ${option.label.toLowerCase()} for this title`} aria-pressed={active} disabled={saving} onClick={(event) => { event.stopPropagation(); setSaving(true); void onChange(movieId, active ? null : option.value).catch(() => undefined).finally(() => setSaving(false)); }}><span className="recommendation-feedback__icon" aria-hidden="true">{Array.from({ length: option.count }, (_, index) => <ThumbIcon key={index} direction={option.direction} />)}</span>{!compact && <strong>{option.label}</strong>}</button>;
    })}
  </div>;
}
