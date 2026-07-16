import type { Profile } from "../types/api";

export interface AvatarPreset {
  id: string;
  label: string;
  background: string;
}

export const PROFILE_AVATAR_PRESETS: AvatarPreset[] = [
  { id: "ember", label: "Ember flare", background: "linear-gradient(135deg, #ff7a18, #9a3412)" },
  { id: "ocean", label: "Ocean signal", background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)" },
  { id: "violet", label: "Violet pulse", background: "linear-gradient(135deg, #a855f7, #5b21b6)" },
  { id: "forest", label: "Forest glow", background: "linear-gradient(135deg, #34d399, #047857)" },
  { id: "rose", label: "Rose cinema", background: "linear-gradient(135deg, #fb7185, #be123c)" },
  { id: "solar", label: "Solar gold", background: "linear-gradient(135deg, #facc15, #b45309)" },
  { id: "slate", label: "Silver glass", background: "linear-gradient(135deg, #cbd5e1, #475569)" },
  { id: "midnight", label: "Midnight", background: "linear-gradient(135deg, #334155, #020617)" },
];

const presetBackgrounds = new Set(PROFILE_AVATAR_PRESETS.map((preset) => preset.background));

function fallbackPreset(profileId: string): AvatarPreset {
  let hash = 0;
  for (const char of profileId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PROFILE_AVATAR_PRESETS[hash % PROFILE_AVATAR_PRESETS.length];
}

export function avatarPresetBackground(profile: Pick<Profile, "id" | "avatarColor">): string {
  return presetBackgrounds.has(profile.avatarColor) ? profile.avatarColor : fallbackPreset(profile.id).background;
}

export function isAvatarPresetBackground(value: string): boolean {
  return presetBackgrounds.has(value);
}
