const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'frontend', 'dist');
const dest = path.resolve(__dirname, '..', 'backend', 'dist', 'public');
if (!fs.existsSync(src)) {
  console.error('Frontend dist not found. Did you run build:frontend?');
  process.exit(1);
}
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

function copyDir(s, d) {
  fs.mkdirSync(d, { recursive: true });
  for (const entry of fs.readdirSync(s)) {
    const sp = path.join(s, entry);
    const dp = path.join(d, entry);
    const stat = fs.statSync(sp);
    if (stat.isDirectory()) copyDir(sp, dp);
    else fs.copyFileSync(sp, dp);
  }
}
copyDir(src, dest);
console.log('Copied frontend dist -> backend/dist/public');
