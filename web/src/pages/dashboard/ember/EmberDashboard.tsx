import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaArtwork } from "../../../components/media/MediaArtwork";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { appUrl, type AppView } from "../../../navigation/queryState";
import { useAuthStore } from "../../../stores/authStore";
import { useProfileStore } from "../../../stores/profileStore";
import type { ThemeApplicationProps } from "../../../themes/application/contracts";
import type { DiscoverMovie, Movie, PlaybackSession } from "../../../types/api";
import { completionFraction, isPlayableMovie } from "../../../utils/media";
import { DetailsRouter } from "../../details/DetailsRouter";
import { EmberDownloads } from "./EmberDownloads";

function EmberStatePanel({ code, title, body, loading = false }: { code: string; title: string; body: string; loading?: boolean }) {
  return <div className="ember-state-panel">{loading && <i aria-hidden="true" />}<p>{code}</p><h2>{title}</h2><span>{body}</span></div>;
}

function EmberMediaCard({ movie, session, onOpen }: { movie: Movie; session?: PlaybackSession; onOpen: (movie: Movie) => void }) {
  const card = useRef<HTMLButtonElement>(null);
  const updateTilt = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !card.current) return;
    const rect = card.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.current.style.setProperty("--tilt-x", `${(0.5 - y) * 15}deg`);
    card.current.style.setProperty("--tilt-y", `${(x - 0.5) * 15}deg`);
    card.current.style.setProperty("--spot-x", `${x * 100}%`);
    card.current.style.setProperty("--spot-y", `${y * 100}%`);
  };
  const resetTilt = () => {
    card.current?.style.setProperty("--tilt-x", "0deg");
    card.current?.style.setProperty("--tilt-y", "0deg");
  };
  return <button ref={card} className="ember-media-card" onPointerMove={updateTilt} onPointerLeave={resetTilt} onBlur={resetTilt} onClick={() => onOpen(movie)}><span className="ember-media-card__art"><MediaArtwork src={movie.thumbnailUrl} alt={movie.title} className="h-full w-full object-cover" /><i aria-hidden="true" /></span><span className="ember-media-card__copy"><strong>{movie.title}</strong><small>{movie.type} / {movie.releaseYear || "year n/a"}</small>{!isPlayableMovie(movie) && <em>Playback unavailable</em>}</span>{session && <ProgressBar className="ember-media-card__progress" progress={completionFraction(session.completionRate)} />}</button>;
}

function EmberRail({ label, title, items, sessions, onOpen }: { label: string; title: string; items: Movie[]; sessions: PlaybackSession[]; onOpen: (movie: Movie) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  if (!items.length) return null;
  const scroll = (direction: number) => rail.current?.scrollBy({ left: direction * Math.min(rail.current.clientWidth * .8, 900), behavior: "smooth" });
  return <section className="ember-rail"><header><div><p>{label}</p><h2>{title}</h2></div><span>{String(items.length).padStart(2, "0")} catalog records</span></header><div className="ember-rail__frame"><button className="ember-rail__blade ember-rail__blade--previous" onClick={() => scroll(-1)} aria-label={`Scroll ${title} backward`}>‹</button><div ref={rail} className="ember-rail__track">{items.map((movie) => <EmberMediaCard key={movie.id} movie={movie} session={sessions.find((session) => session.movieId === movie.id)} onOpen={onOpen} />)}</div><button className="ember-rail__blade ember-rail__blade--next" onClick={() => scroll(1)} aria-label={`Scroll ${title} forward`}>›</button></div></section>;
}

function EmberActions({ movie, onDetails, onPlay }: { movie: Movie; onDetails: () => void; onPlay: () => void }) {
  const playable = isPlayableMovie(movie);
  if (movie.type === "series") return <div className="ember-actions"><button className="ember-action ember-action--primary" onClick={onDetails}>Select episode</button><button className="ember-action" onClick={onDetails}>View details</button></div>;
  return <div className="ember-actions">{playable ? <button className="ember-action ember-action--primary" onClick={onPlay}>Initialize playback</button> : <button className="ember-action ember-action--primary" onClick={onDetails}>View details</button>}<button className="ember-action" disabled={!playable} onClick={playable ? onDetails : undefined}>{playable ? "View details" : "Playback unavailable"}</button></div>;
}

function EmberHome({ controller, onDetails, onPlay }: Pick<ThemeApplicationProps, "controller"> & { onDetails: (movie: Movie) => void; onPlay: (movie: Movie) => void }) {
  const featured = controller.featured;
  if (!featured) return <EmberStatePanel code="NO CATALOG SIGNAL" title="The catalog is empty" body="No media records were returned by the server." />;
  return <div className="ember-home"><section className="ember-hero"><div className="ember-hero__art"><MediaArtwork src={featured.bannerUrl || featured.thumbnailUrl} alt={featured.title} className="h-full w-full object-cover" /></div><div className="ember-hero__shade" /><div className="ember-hero__copy"><span className="ember-status"><i />CATALOG ONLINE</span><small>FEATURED TRANSMISSION / {featured.type.toUpperCase()}</small><h1>{featured.title}</h1><p>{featured.description || "No server description is available for this title."}</p><div className="ember-meta"><span>{featured.releaseYear || "YEAR N/A"}</span>{featured.quality && <span>{featured.quality}</span>}{featured.genres[0] && <span>{featured.genres[0]}</span>}</div><EmberActions movie={featured} onDetails={() => onDetails(featured)} onPlay={() => onPlay(featured)} /></div></section><div className="ember-collections"><EmberRail label="RESUME INDEX" title="Continue watching" items={controller.continueWatching} sessions={controller.sessions} onOpen={onDetails} /><EmberRail label="FEATURE ARCHIVE" title="Movies" items={controller.movieItems} sessions={controller.sessions} onOpen={onDetails} /><EmberRail label="EPISODIC ARCHIVE" title="Series" items={controller.seriesItems} sessions={controller.sessions} onOpen={onDetails} /></div></div>;
}

function EmberBrowse({ query, controller, onGenre, onOpen }: Pick<ThemeApplicationProps, "query" | "controller"> & { onGenre: (genre?: string) => void; onOpen: (movie: Movie) => void }) {
  const source = query.view === "series" ? controller.seriesItems : controller.movieItems;
  return <section className="ember-browse"><header className="ember-page-heading"><div><p>SERVER CATALOG / {query.view.toUpperCase()}</p><h1>{query.view === "series" ? "Series archive" : "Movie archive"}</h1></div><span>{controller.browseItems.length} catalog records</span></header>{source.length > 0 && <div className="ember-filters"><button data-active={!query.genre} onClick={() => onGenre()}>All</button>{controller.genres.map((genre) => <button key={genre} data-active={query.genre?.toLocaleLowerCase() === genre.toLocaleLowerCase()} onClick={() => onGenre(genre)}>{genre}</button>)}</div>}{controller.browseItems.length ? <div className="ember-grid">{controller.browseItems.map((movie) => <EmberMediaCard key={movie.id} movie={movie} session={controller.sessions.find((session) => session.movieId === movie.id)} onOpen={onOpen} />)}</div> : <EmberStatePanel code="NO CATALOG SIGNAL" title={`No ${query.view} found`} body={query.genre ? "No server titles match this genre filter." : "The server has not catalogued titles for this view."} />}</section>;
}

function resultToMovie(result: DiscoverMovie, movies: Movie[]): Movie | null {
  const id = result.type === "series" ? `tv_${result.tmdbId}` : `m_${result.tmdbId}`;
  return movies.find((movie) => movie.id === id) ?? null;
}

function EmberSearch({ query, controller, onOpen, onSearch }: Pick<ThemeApplicationProps, "query" | "controller"> & { onOpen: (movie: Movie) => void; onSearch: (value: string) => void }) {
  const [draft, setDraft] = useState(query.q ?? "");
  useEffect(() => setDraft(query.q ?? ""), [query.q]);
  const submit = (event: React.FormEvent) => { event.preventDefault(); onSearch(draft.trim()); };
  const results = controller.results.map((result) => ({ result, movie: resultToMovie(result, controller.movies) }));
  return <section className="ember-browse ember-search"><header className="ember-page-heading"><div><p>SERVER SEARCH</p><h1>{query.q ? `Results for “${query.q}”` : "Search the catalog"}</h1></div>{query.q && <span>{results.filter((item) => item.movie).length} local records</span>}</header><form className="ember-search__form" onSubmit={submit}><input aria-label="Search server catalog" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Title, film, or series" /><button type="submit">Search server</button></form>{controller.searching ? <EmberStatePanel code="QUERY ACTIVE" title="Searching the server" body={`Looking for “${query.q}”.`} loading /> : !query.q ? <EmberStatePanel code="AWAITING QUERY" title="Search is ready" body="Enter a title to search the server catalog." /> : !results.length ? <EmberStatePanel code="NO MATCH" title="No results" body="The server did not return matches for this query." /> : <div className="ember-search__results">{results.map(({ result, movie }) => <button key={`${result.type}-${result.tmdbId}`} disabled={!movie} onClick={() => movie && onOpen(movie)}><MediaArtwork src={result.thumbnailUrl} alt={result.title} className="ember-search__art" /><span><strong>{result.title}</strong><small>{movie ? "Available in server catalog" : "Not available in local catalog"}</small></span></button>)}</div>}</section>;
}

export function EmberDashboard({ query, controller, presentation }: ThemeApplicationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfileStore((state) => state.activeProfile)!;
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const logout = useAuthStore((state) => state.logout);
  const Background = presentation.Background;
  const Navigation = presentation.Navigation;
  const appNavigate = (view: AppView, options: Parameters<typeof appUrl>[2] = {}) => navigate(appUrl(profile.id, view, options), { state: { fromApp: true, previous: location.search } });
  const openDetails = (movie: Movie) => appNavigate("details", { media: movie.id });
  const openWatch = (movie: Movie) => appNavigate("watch", { media: movie.id });
  const selected = query.media ? controller.movies.find((movie) => movie.id === query.media) ?? null : null;
  const navigationProps = { profile, activeView: query.view, query: query.q, isAdmin: profile.id === "1", onView: (view: AppView) => appNavigate(view), onSearch: (value: string) => appNavigate("search", value ? { q: value } : {}), onProfiles: () => { clearProfile(); navigate("/profiles"); }, onAdmin: () => appNavigate("admin", { section: "account" }), onLogout: logout };

  return <div className="theme-app theme-app--ember ember-app" data-theme="ember" data-view={query.view}><Background /><Navigation {...navigationProps} /><main className="theme-main ember-main">{controller.error && <div className="ember-error" role="alert">{controller.error}</div>}{controller.loading ? <EmberStatePanel code="CATALOG HANDSHAKE" title="Loading server catalog" body="Synchronizing this profile with the server index." loading /> : query.view === "home" ? <EmberHome controller={controller} onDetails={openDetails} onPlay={openWatch} /> : query.view === "movies" || query.view === "series" ? <EmberBrowse query={query} controller={controller} onGenre={(genre) => appNavigate(query.view, genre ? { genre } : {})} onOpen={openDetails} /> : query.view === "search" ? <EmberSearch query={query} controller={controller} onOpen={openDetails} onSearch={(value) => appNavigate("search", value ? { q: value } : {})} /> : query.view === "downloads" ? <EmberDownloads /> : query.view === "details" ? selected ? <DetailsRouter movie={selected} onClose={() => appNavigate("home")} isWatchlisted={controller.watchlist.includes(selected.id)} onWatchlistChange={controller.setWatchlist} /> : <EmberStatePanel code="INVALID MEDIA ID" title="Title not found" body="That media identifier is not present in the server catalog." /> : null}</main></div>;
}
