import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { parseAppQuery } from "../navigation/queryState";
import { MOTION_EASE, MOTION_TIMINGS, resetApplicationScroll, THEME_MOTION, useAppMotion } from "../motion/motionSystem";
import { useThemeStore } from "../stores/themeStore";
import { AdminGate } from "./admin/AdminGate";
import { DashboardRouter } from "./dashboard/DashboardRouter";
import { PlayerPage } from "./player/PlayerPage";

export function AuthenticatedApp() {
  const location = useLocation();
  const query = useMemo(() => parseAppQuery(location.search), [location.search]);
  const theme = useThemeStore((state) => state.activeTheme);
  const { reduced } = useAppMotion();
  useEffect(() => {
    if (query.view === "watch" || query.view === "admin") resetApplicationScroll();
  }, [query.view]);
  const standaloneTransition = { duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.view, ease: MOTION_EASE };
  if (query.view === "watch") return <motion.div className="standalone-motion-view" variants={reduced ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : THEME_MOTION[theme].view} initial="initial" animate="animate" transition={standaloneTransition}><PlayerPage /></motion.div>;
  if (query.view === "admin") return <motion.div className="standalone-motion-view" variants={reduced ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : THEME_MOTION[theme].view} initial="initial" animate="animate" transition={standaloneTransition}><AdminGate /></motion.div>;
  return <DashboardRouter />;
}
