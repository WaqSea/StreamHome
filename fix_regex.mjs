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
    content = content.replace(search, replace);
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

const globalReplacements = [
  [/\.poster_url/g, '.thumbnailUrl'],
  [/\.backdrop_url/g, '.bannerUrl'],
  [/\.plot/g, '.description'],
  [/\.year/g, '.releaseYear'],
  [/\.tmdb_id/g, '.id'],
  [/\.movie_id/g, '.movieId'],
  [/\.position/g, '.timestamp'],
  [/\.duration/g, '.durationWatched'], // careful, this might break movie.duration -> movie.durationWatched which is wrong. 
];
processDirectory(webSrcDir, globalReplacements);

// Fix movie duration where it mistakenly replaced
const fixDurationReplacements = [
  [/movie\.durationWatched/g, 'movie.duration'],
  [/m\.durationWatched/g, 'm.duration'],
];
processDirectory(webSrcDir, fixDurationReplacements);

// Fix LoginPage authResponse types
const loginPagePath = path.join(webSrcDir, 'pages', 'LoginPage.tsx');
replaceInFile(loginPagePath, [
  [/\(res as any\)\.requires2fa/g, '((res as any).requires2fa)'],
  [/\.requires2fa/g, '((res as any).requires2fa)'],
  [/\.accessToken/g, '((res as any).accessToken)']
]);
replaceInFile(loginPagePath, [
  [/ref=\{\(el\) => \{ otpRefs\.current\[index\] = el; \}\}/g, 'ref={(el: HTMLInputElement | null) => { if (el) otpRefs.current[index] = el; }}']
]);
