import { Item } from './api';
import { copyWithTimeout } from '../../lib/clipboard';
import { useState } from 'react';

function hostFavicon(url?: string) {
  if (!url) return '/src/assets/categories/other.svg';
  try {
    const u = new URL(url);
    const letter = u.hostname[0]?.toUpperCase() || '?';
    // Create a data URL SVG locally (no network)
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' rx='8' fill='%23eee'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='24' font-family='sans-serif' fill='%23000'>${letter}</text></svg>`;
  } catch { return '/src/assets/categories/other.svg'; }
}

export default function Card({ item }: { item: Item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-xl border p-3 flex gap-3 bg-white/50 dark:bg-white/5">
      <img src={hostFavicon(item.url)} className="h-10 w-10 rounded-md" alt="icon" />
      <div className="flex-1">
        <div className="font-medium">{item.displayName}</div>
        <div className="text-xs opacity-70">{item.category} • {item.tags?.join(', ')}</div>
        <div className="mt-2 text-sm flex flex-wrap gap-2 items-center">
          <button className="px-2 py-1 rounded-md border" onClick={() => copyWithTimeout(item.username || '')}>Copy user</button>
          <button className="px-2 py-1 rounded-md border" onClick={() => copyWithTimeout(item.password || '')}>Copy password</button>
          <button className="px-2 py-1 rounded-md border" onClick={() => setRevealed(r=>!r)}>{revealed? 'Hide' : 'Peek'}</button>
          {revealed && <span className="font-mono">{item.password}</span>}
        </div>
      </div>
    </div>
  );
}
