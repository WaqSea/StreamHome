import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webSrcDir = path.join(__dirname, 'web', 'src');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  for (const [search, replace] of replacements) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir, replacements) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, replacements);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath, replacements);
    }
  }
}

// 1. Global replacements
const globalReplacements = [
  ['movie.poster_url', 'movie.thumbnailUrl'],
  ['movie.backdrop_url', 'movie.bannerUrl'],
  ['movie.plot', 'movie.description'],
  ['movie.year', 'movie.releaseYear'],
  ['movie.tmdb_id', 'movie.id'],
  ['session.movie_id', 'session.movieId'],
  ['session.position', 'session.timestamp'],
  ['session.duration', 'session.durationWatched'],
  ['profile.avatar_color', 'profile.avatarColor'],
  ['JSX.Element', 'React.ReactNode']
];
processDirectory(webSrcDir, globalReplacements);

// 2. formatDuration fix
const formatUtilsPath = path.join(webSrcDir, 'utils', 'format.ts');
replaceInFile(formatUtilsPath, [
  ['export function formatDuration(seconds: number): string {', 'export function formatDuration(seconds: number | string): string {\n  if (typeof seconds === "string") return seconds;']
]);

// 3. LoginPage fixes
const loginPagePath = path.join(webSrcDir, 'pages', 'LoginPage.tsx');
replaceInFile(loginPagePath, [
  ['{ username: email, password }', '{ email, password }'],
  ['requires_2fa', 'requires2fa'],
  ['access_token', 'accessToken'],
  ['ref={(el) => otpRefs.current[index] = el}', 'ref={(el) => { otpRefs.current[index] = el; }}']
]);

console.log('Fixes applied round 2.');
