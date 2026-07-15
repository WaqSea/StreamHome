import type React from "react";
import type { AppQueryState, AppView } from "../../navigation/queryState";
import type { CatalogController } from "../../pages/dashboard/useCatalogController";
import type { Profile } from "../../types/api";
import type { ThemeId } from "../../types/theme";

export interface ThemeNavigationProps {
  profile: Profile;
  activeView: AppView;
  query?: string;
  isAdmin: boolean;
  onView: (view: AppView) => void;
  onSearch: (query: string) => void;
  onProfiles: () => void;
  onAdmin: () => void;
  onLogout: () => void;
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
}

export interface ThemeApplicationProps {
  query: AppQueryState;
  controller: CatalogController;
  presentation: ThemePresentation;
}
