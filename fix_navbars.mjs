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

const navbars = ['AuroraNavbar.tsx', 'CinemaNavbar.tsx', 'EmberNavbar.tsx', 'GeminiNavbar.tsx'];
for (const nav of navbars) {
  replaceInFile(path.join(webSrcDir, 'components', 'layout', nav), [
    ['avatar_color', 'avatarColor']
  ]);
}
