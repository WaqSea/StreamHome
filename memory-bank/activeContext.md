# Active Context

## Current focus

The current web-only repair restores server-owned artwork rendering. It retains the completed Ember rebuild, profile management, view scroll restoration, and URL-synchronized series auto-advance. The server remains unchanged and is the source of truth for all media information.

## Current web architecture

- React routes are protected by hydrated auth and a query-aware profile guard that resolves `profile` against server profiles.
- API modules normalize the server's wire format into stable TypeScript models.
- The selected profile controls one of four canonical themes: Ember, Aurora, Cinema, or Gemini. Legacy, missing, and unknown values fall back to Ember; only explicit `cinema` selects Cinema.
- The authenticated application uses canonical query state such as `/?profile=1&view=series`; search, genres, details, seasons, playback, downloads, and admin sections are deep-linkable.
- Shared catalog controller hooks own API behavior while a typed theme registry selects distinct Ember, Aurora, Cinema, and Gemini navigation, heroes, cards, details, and player presentation.
- Ember follows the Obsidian Frost reference: sharp obsidian glass, restrained orange glow, scanlines, serif display type, and technical mono labels. Aurora, Cinema, and Gemini retain separate editorial, cinematic, and workspace identities.
- `MediaArtwork` accepts direct server media paths and absolute HTTP(S) URLs. Compact server artwork filenames are resolved against the server-returned movie or episode identity into `/media/...` candidates; it never substitutes a bundled media image.
- The player resolves its movie or episode from authenticated server APIs and refuses playback when no physical media URL exists.
- Admin exposes only implemented server capabilities: current-account TOTP, storage/HEVC settings, and read-only download events.

## Security and data boundaries

- No media metadata or media files are stored in the web source tree.
- The ingestion API token is not exposed by the web client.
- SMTP/email OTP is not referenced; authentication and admin reauthentication use local TOTP.
- Queue source URLs are neither typed for UI use nor rendered.

## Next step

The artwork repair has passed TypeScript lint, 24 frontend tests, the production build, the required database checker, server-media boundary scanning, complete 66-file catalog coverage, and visual source-file inspection. No implementation follow-up is pending.
