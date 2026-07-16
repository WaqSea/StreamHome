import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ThemeId } from "../types/theme";

export const MOTION_TIMINGS = {
  hover: 0.8,
  menu: 1.2,
  menuItem: 0.72,
  dialog: 1.35,
  viewExit: 0.8,
  viewEnter: 1.2,
  view: 2,
  rail: 1500,
  billboard: 2.3,
  profileMorph: 2.2,
  profileEntry: 1.3,
  reduced: 0.18,
} as const;

export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export interface ThemeMotionDefinition {
  view: Variants;
  billboard: Variants;
  cardHover: { y: number; scale: number };
}

const viewVariants = (initial: Record<string, string | number>, exit: Record<string, string | number>): Variants => ({
  initial,
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: MOTION_TIMINGS.viewEnter, ease: MOTION_EASE },
  },
  exit: { ...exit, transition: { duration: MOTION_TIMINGS.viewExit, ease: MOTION_EASE } },
});

const billboardVariants = (initial: Record<string, string | number>, exit: Record<string, string | number>): Variants => ({
  initial: (direction: number = 1) => ({ ...initial, x: typeof initial.x === "number" ? initial.x * direction : initial.x }),
  animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" },
  exit: (direction: number = 1) => ({ ...exit, x: typeof exit.x === "number" ? exit.x * direction : exit.x }),
});

export const THEME_MOTION: Record<ThemeId, ThemeMotionDefinition> = {
  ember: {
    view: viewVariants({ opacity: 0, y: 26, scale: 1.012, filter: "blur(9px)" }, { opacity: 0, y: -16, scale: .992, filter: "blur(7px)" }),
    billboard: billboardVariants({ opacity: 0, x: 34, scale: 1.022, filter: "blur(11px)" }, { opacity: 0, x: -26, scale: .99, filter: "blur(8px)" }),
    cardHover: { y: -8, scale: 1.035 },
  },
  aurora: {
    view: viewVariants({ opacity: 0, y: 34, scale: .985, filter: "blur(14px)" }, { opacity: 0, y: -22, scale: 1.008, filter: "blur(12px)" }),
    billboard: billboardVariants({ opacity: 0, x: 18, y: 28, scale: .985, filter: "blur(16px)" }, { opacity: 0, x: -14, y: -20, scale: 1.012, filter: "blur(13px)" }),
    cardHover: { y: -10, scale: 1.035 },
  },
  cinema: {
    view: viewVariants({ opacity: 0, x: 24, scale: 1.018, filter: "blur(8px)" }, { opacity: 0, x: -20, scale: 1.026, filter: "blur(7px)" }),
    billboard: billboardVariants({ opacity: 0, x: 42, scale: 1.028, filter: "blur(8px)" }, { opacity: 0, x: -34, scale: 1.012, filter: "blur(6px)" }),
    cardHover: { y: -7, scale: 1.04 },
  },
  gemini: {
    view: viewVariants({ opacity: 0, x: 30, y: 12, scale: .982, filter: "blur(10px)" }, { opacity: 0, x: -22, y: -8, scale: .99, filter: "blur(8px)" }),
    billboard: billboardVariants({ opacity: 0, x: 36, y: 16, scale: .98, filter: "blur(12px)" }, { opacity: 0, x: -28, y: -10, scale: .99, filter: "blur(9px)" }),
    cardHover: { y: -8, scale: 1.03 },
  },
};

interface MotionContextValue {
  reduced: boolean;
  documentHidden: boolean;
}

const MotionContext = createContext<MotionContextValue>({ reduced: false, documentHidden: false });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReduced, setPrefersReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [documentHidden, setDocumentHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReduced(media.matches);
    const update = () => setDocumentHidden(document.hidden);
    media.addEventListener?.("change", updateMotion);
    document.addEventListener("visibilitychange", update);
    return () => {
      media.removeEventListener?.("change", updateMotion);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const value = useMemo(() => ({ reduced: Boolean(prefersReduced), documentHidden }), [documentHidden, prefersReduced]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useAppMotion(): MotionContextValue {
  return useContext(MotionContext);
}

export function resetApplicationScroll(): void {
  const root = document.getElementById("root");
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function AnimatedView({ theme, viewKey, children }: { theme: ThemeId; viewKey: string; children: React.ReactNode }) {
  const { reduced } = useAppMotion();
  const definition = THEME_MOTION[theme];
  const reducedVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: MOTION_TIMINGS.reduced, ease: MOTION_EASE } },
    exit: { opacity: 0, transition: { duration: MOTION_TIMINGS.reduced, ease: MOTION_EASE } },
  };
  return <AnimatePresence mode="wait" initial={false} onExitComplete={resetApplicationScroll}>
    <motion.div
      className="motion-view"
      key={viewKey}
      variants={reduced ? reducedVariants : definition.view}
      initial="initial"
      animate="animate"
      exit="exit"
    >{children}</motion.div>
  </AnimatePresence>;
}
