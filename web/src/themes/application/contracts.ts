import type React from "react";
import type { AppQueryState, AppView } from "../../navigation/queryState";
import type { CatalogController } from "../../pages/dashboard/useCatalogController";
import type { Profile } from "../../types/api";
import type { ThemeId } from "../../types/theme";
import type { ThemeMotionDefinition } from "../../motion/motionSystem";

export interface ThemeNavigationProps {
  profile: Profile;
  activeView: AppView;
  query?: string;
  isAdmin: boolean;
  onView: (view: AppView) => void;
  onSearch: (query: string) => void;
  onProfiles: () => void;
  onEditProfile: () => void;
  onAdmin: () => void;
  onLogout: () => void;
}

export type ThemeInteractionId = "terminal" | "editorial" | "cinematic" | "workspace";

export interface ThemeInteractionProfile {
  id: ThemeInteractionId;
  action: "edge-grow" | "soft-bloom" | "theatrical-grow" | "modular-lift";
  navigation: "signal-line" | "glass-pill" | "spotlight-underline" | "directional-rail";
  card: "technical-tilt" | "floating-glass" | "poster-depth" | "module-elevation";
  rail: "square" | "orb" | "cinema-disc" | "rounded-module";
  timing: { enterMs: number; exitMs: number; pressMs: number };
  easing: string;
}

export interface ThemePresentation {
  id: ThemeId;
  label: string;
  Background: React.ComponentType;
  Navigation: React.ComponentType<ThemeNavigationProps>;
  shellClass: string;
  heroVariant: "terminal" | "editorial" | "cinematic" | "workspace";
  browseVariant: "technical" | "masonry" | "rails" | "modules";
  cardVariant: "sharp" | "glass" | "poster" | "module";
  detailsVariant: "terminal" | "editorial" | "cinematic" | "workspace";
  playerVariant: "terminal" | "minimal" | "cinematic" | "workspace";
  interaction: ThemeInteractionProfile;
  motion: ThemeMotionDefinition;
}

export interface ThemeApplicationProps {
  query: AppQueryState;
  controller: CatalogController;
  presentation: ThemePresentation;
}
