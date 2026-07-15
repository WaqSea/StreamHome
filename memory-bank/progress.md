# Progress Status

## Server

- [x] FastAPI, SQLModel/SQLite, FFmpeg, TMDB enrichment, download queue processing, local/cloud storage settings, recovery scanning, and range streaming are implemented.
- [x] The database path is standardized to the absolute `server/database.db` path resolved from `server/config.py`.
- [x] Physical media, artwork, subtitles, and `.metadata/metadata.json` records live under `server/media`; FastAPI exposes that catalog through `/media` and authenticated API routes.
- [x] Movie ingestion excludes `season` and `episode`; series ingestion supplies them when applicable.
- [x] Authentication uses password plus optional local TOTP. SMTP and email OTP support are removed.
- [x] Download progress is available through the authenticated SSE queue endpoint.
- [x] Storage and background HEVC settings are available through the server settings API.

The server was deliberately not changed during the current web repair. Existing detailed server behavior remains documented in the server code and `memory-bank/mediaSenderAPI.md`.

## Ember Obsidian Glass rebuild

- [x] Approved implementation plan covers the dedicated Ember component tree, legacy-theme compatibility adapter, profile editing/deletion, view scroll restoration, and episode URL synchronization.
- [x] Legacy `netflix`, missing, and unknown profile themes now resolve to Ember; explicit canonical theme identifiers remain unchanged.
- [x] Authenticated theme state is no longer written to the document root, protecting standalone pages from theme leakage.
- [x] Added shared profile update/removal state operations and the frontend profile-save API contract.
- [x] Added query-view scroll restoration at the authenticated application boundary.
- [x] Added server-backed create/edit/delete profile management with all four canonical theme choices, typed-name deletion confirmation, and administrator deletion protection.
- [x] Added a typed theme application contract: Ember owns a dedicated component tree while Aurora, Cinema, and Gemini continue through their unchanged compatibility adapter.
- [x] Rebuilt Ember home, archive, search, details, downloads, loading, error, empty, and unavailable states with the supplied Obsidian Glass visual language and responsive navigation.
- [x] Series playback now resolves the ordered server episode list, auto-advances to the next playable episode, and replaces the URL `media` parameter without adding a redundant history entry.
- [x] Decorative Ember animation pauses while the document is hidden and respects reduced-motion preferences.

## Previous web repair baseline

- [x] Replaced optimistic/mismatched client types with normalization at the API boundary for auth, movies, episodes, playback, profiles, settings, and queue events.
- [x] Fixed auth hydration, TOTP response-key normalization, and profile restoration. The former `netflix` to Cinema compatibility rule has now been superseded by the Ember fallback required by the approved rebuild.
- [x] Removed all bundled poster/backdrop assets and mock media fallbacks. The web client now displays only server-provided media URLs; absent or unusable artwork becomes a neutral CSS placeholder.
- [x] Replaced the generic dashboard shell with shared server-data controllers and four distinct presentation systems: Obsidian Frost Ember, editorial Aurora, cinematic Cinema, and workspace Gemini.
- [x] Added canonical query navigation for `profile`, `view`, `media`, `genre`, `season`, `q`, and admin `section`, including validation, legacy redirects, refresh restoration, and browser history.
- [x] Implemented working catalog tabs, search, watchlist, details, TV season/episode selection, profile switching, and read-only download progress.
- [x] Rebuilt the player around server catalog records, authenticated stream URLs, quality selection, playback reporting, subtitles, and skip markers. Records without playable media are visibly unavailable.
- [x] Reduced the web admin center to supported server capabilities: Account/TOTP, Storage/HEVC, and read-only Downloads. Removed unsupported backup, update, user mutation, source URL, and queue-cancel controls.
- [x] Added an application error boundary and focused Vitest coverage for API normalization, playback payloads, store migration/hydration, and media URL filtering.

## Validation

- [x] `npm run lint`
- [x] `npm test` (10 files, 21 tests)
- [x] `npm run build`
- [x] Live browser validation against the local server: Ember desktop/mobile home, movies, details, series-empty, downloads-empty, profile gallery/settings, safe create/delete, query navigation, and scroll restoration.
- [x] Created and removed a temporary Gemini profile during QA to verify the Aurora/Cinema/Gemini compatibility application remains intact.
- [x] `server/scratch/check_db.py` (33 catalog records, 0 episodes, 0 playback sessions).
- [x] Production web tree scan found no bundled media files, metadata records, or temporary QA artifacts.

## Remaining server backlog

- [ ] Expose rclone upload progress in a supported server API before adding it to the web UI.
- [ ] Add server-side subtitle conversion only if it remains a product requirement.
