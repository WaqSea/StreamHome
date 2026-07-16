import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { getEpisodes } from "../../api/movies";
import { toggleWatchlist } from "../../api/watchlist";
import { MediaArtwork } from "../../components/media/MediaArtwork";
import { appUrl, parseAppQuery } from "../../navigation/queryState";
import { useProfileStore } from "../../stores/profileStore";
import { useThemeStore } from "../../stores/themeStore";
import { getThemeDefinition } from "../../themes/application/themeRegistry";
import type { Episode, Movie } from "../../types/api";
import { isPlayableMovie, tmdbIdFromMovie } from "../../utils/media";
import { AnimatedState, CONTENT_REVEAL, CONTENT_STAGGER, MOTION_EASE, MOTION_TIMINGS, useAppMotion } from "../../motion/motionSystem";

interface DetailsRouterProps {
  movie: Movie;
  onClose: () => void;
  isWatchlisted: boolean;
  onWatchlistChange: (ids: string[]) => void;
}

export function DetailsRouter({ movie, onClose, isWatchlisted, onWatchlistChange }: DetailsRouterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfileStore((state) => state.activeProfile)!;
  const theme = useThemeStore((state) => state.activeTheme);
  const definition = getThemeDefinition(theme);
  const query = useMemo(() => parseAppQuery(location.search), [location.search]);
  const [episodes, setEpisodes] = useState<Episode[]>(movie.episodes ?? []);
  const [loadingEpisodes, setLoadingEpisodes] = useState(movie.type === "series" && !movie.episodes?.length);
  const [error, setError] = useState("");
  const [savingWatchlist, setSavingWatchlist] = useState(false);
  const { reduced } = useAppMotion();

  useEffect(() => {
    if (movie.type !== "series") return;
    const tmdbId = tmdbIdFromMovie(movie);
    if (tmdbId === null) { setLoadingEpisodes(false); setError("This series does not have a valid server identifier."); return; }
    let active = true;
    setLoadingEpisodes(true);
    getEpisodes(tmdbId)
      .then((data) => { if (active) setEpisodes(data); })
      .catch((requestError: unknown) => { if (active) setError(requestError instanceof Error ? requestError.message : "Episodes could not be loaded."); })
      .finally(() => { if (active) setLoadingEpisodes(false); });
    return () => { active = false; };
  }, [movie]);

  const seasons = useMemo(() => Array.from(new Set(episodes.map((episode) => episode.seasonNumber))).sort((a, b) => a - b), [episodes]);
  const selectedSeason = query.season && seasons.includes(query.season) ? query.season : seasons[0];
  const visibleEpisodes = episodes.filter((episode) => episode.seasonNumber === selectedSeason);
  const playable = isPlayableMovie({ ...movie, episodes });

  useEffect(() => {
    if (movie.type !== "series" || !seasons.length || query.season === selectedSeason) return;
    navigate(appUrl(profile.id, "details", { media: movie.id, season: selectedSeason }), { replace: true, state: location.state });
  }, [location.state, movie.id, movie.type, navigate, profile.id, query.season, seasons.length, selectedSeason]);

  const close = () => {
    if ((location.state as { fromApp?: boolean } | null)?.fromApp) navigate(-1);
    else onClose();
  };
  const updateWatchlist = async () => {
    setSavingWatchlist(true); setError("");
    try { onWatchlistChange((await toggleWatchlist(profile.id, movie.id)).watchlist); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Watchlist could not be updated."); }
    finally { setSavingWatchlist(false); }
  };
  const selectSeason = (season: number) => navigate(appUrl(profile.id, "details", { media: movie.id, season }), { replace: true, state: location.state });
  const play = (media: string) => navigate(appUrl(profile.id, "watch", { media }), { state: { fromApp: true, previous: location.search } });

  const stateKey = loadingEpisodes ? "loading" : visibleEpisodes.length ? `season-${selectedSeason}` : "empty";
  const feedback = !playable ? "Playback is unavailable because the server did not provide a playable media file." : error;

  return <motion.article className="details-view" data-details-theme={definition.detailsVariant} variants={CONTENT_STAGGER} initial="hidden" animate="shown">
    <motion.button variants={CONTENT_REVEAL} className="details-close" onClick={close}>Close / Back</motion.button>
    <motion.section variants={CONTENT_REVEAL} className="details-hero">
      <motion.div className="details-backdrop" initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.billboard, ease: MOTION_EASE }}><MediaArtwork src={movie.bannerUrl || movie.thumbnailUrl} alt={movie.title} media={movie} className="h-full w-full object-cover" /></motion.div>
      <motion.div className="details-poster" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reduced ? MOTION_TIMINGS.reduced : MOTION_TIMINGS.artwork, delay: reduced ? 0 : .1, ease: MOTION_EASE }}><MediaArtwork src={movie.thumbnailUrl} alt={movie.title} media={movie} className="h-full w-full object-cover" /></motion.div>
      <motion.div variants={CONTENT_STAGGER} className="details-copy"><motion.p variants={CONTENT_REVEAL}>{movie.type.toUpperCase()} / SERVER RECORD</motion.p><motion.h1 variants={CONTENT_REVEAL}>{movie.title}</motion.h1><motion.div variants={CONTENT_REVEAL} className="details-meta">{movie.releaseYear > 0 && <span>{movie.releaseYear}</span>}{movie.duration && <span>{movie.duration}</span>}{movie.rating && <span>{movie.rating}</span>}{movie.quality && <span>{movie.quality}</span>}{movie.voteAverage > 0 && <span>{movie.voteAverage.toFixed(1)} / 10</span>}</motion.div>{movie.description && <motion.p variants={CONTENT_REVEAL} className="details-description">{movie.description}</motion.p>}{movie.genres.length > 0 && <motion.div variants={CONTENT_REVEAL} className="details-genres">{movie.genres.map((genre) => <span key={genre}>{genre}</span>)}</motion.div>}<motion.div variants={CONTENT_REVEAL} className="feature-actions">{movie.type === "movie" && <button className="feature-action feature-action--primary" disabled={!movie.videoUrl} onClick={() => play(movie.id)}>Play now</button>}<motion.button layout className="feature-action" disabled={savingWatchlist} onClick={() => void updateWatchlist()}>{savingWatchlist ? "Updating…" : isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}</motion.button></motion.div><AnimatePresence mode="wait">{feedback && <motion.p key={feedback} className="details-warning" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: MOTION_TIMINGS.notice }}>{feedback}</motion.p>}</AnimatePresence></motion.div>
    </motion.section>
    {movie.type === "series" && <motion.section variants={CONTENT_REVEAL} className="episode-browser"><header><div><p>EPISODE INDEX</p><h2>Seasons and episodes</h2></div><div className="season-tabs">{seasons.map((season) => <motion.button layout key={season} data-active={selectedSeason === season} onClick={() => selectSeason(season)}>Season {season}</motion.button>)}</div></header><AnimatedState stateKey={stateKey}>{loadingEpisodes ? <p className="episode-state">Loading episodes from the server...</p> : !visibleEpisodes.length ? <p className="episode-state">No episodes are available from the server.</p> : <motion.div variants={CONTENT_STAGGER} initial="hidden" animate="shown" className="episode-grid">{visibleEpisodes.map((episode) => <motion.button layout variants={CONTENT_REVEAL} key={episode.id} className="episode-card" disabled={!episode.videoUrl} onClick={() => play(episode.id)}><MediaArtwork src={episode.thumbnailUrl} alt={episode.title} media={movie} episode={episode} className="episode-card__art" /><span><small>EPISODE {episode.episodeNumber}</small><strong>{episode.title}</strong><p>{episode.description || "No server description available."}</p><i>{episode.videoUrl ? episode.duration : "Unavailable on server"}</i></span></motion.button>)}</motion.div>}</AnimatedState></motion.section>}
  </motion.article>;
}
