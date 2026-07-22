import React from "react";

export type MediaActionIconName = "back" | "play" | "resume" | "bookmark-add" | "bookmark-remove" | "episode";

interface MediaActionIconProps {
  name: MediaActionIconName;
  className?: string;
}

export function MediaActionIcon({ name, className = "" }: MediaActionIconProps) {
  const paths: Record<MediaActionIconName, React.ReactNode> = {
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    play: <path d="m9 7 8 5-8 5V7Z" />,
    resume: <><path d="M5 12a7 7 0 1 0 2.05-4.95" /><path d="M5 6v6h6" /><path d="m11 9 5 3-5 3V9Z" /></>,
    "bookmark-add": <><path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3-5 3V4.75Z" /><path d="M12 7v6" /><path d="M9 10h6" /></>,
    "bookmark-remove": <><path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3-5 3V4.75Z" /><path d="M9 10h6" /></>,
    episode: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m10 9 5 3-5 3V9Z" /></>,
  };

  return (
    <svg
      className={`media-action-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
