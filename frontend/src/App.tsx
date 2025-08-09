import { Suspense, useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { motion } from 'framer-motion';
import { LucideMoon, LucideSun } from 'lucide-react';
import Login from './features/auth/Login';
import List from './features/items/List';
import { toast } from 'sonner';

type Theme = 'light' | 'dark';
interface UIState {
  theme: Theme;
  palette: 'aurora' | 'noir' | 'sakura';
  setTheme: (t: Theme) => void;
  setPalette: (p: UIState['palette']) => void;
}
export const useUI = create<UIState>((set) => ({
  theme: (localStorage.getItem('av.theme') as Theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  palette: (localStorage.getItem('av.palette') as any) || 'aurora',
  setTheme: (t) => { localStorage.setItem('av.theme', t); set({ theme: t }); },
  setPalette: (p) => { localStorage.setItem('av.palette', p); set({ palette: p }); }
}));

function ThemeToggle() {
  const { theme, setTheme } = useUI();
  return (
    <button
      aria-label="Toggle theme"
      className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <LucideSun /> : <LucideMoon />}
    </button>
  );
}

export default function App() {
  const { theme, palette } = useUI();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.remove('theme-aurora', 'theme-noir', 'theme-sakura');
    document.body.classList.add(`theme-${palette}`);
  }, [theme, palette]);

  const [authed, setAuthed] = useState<boolean>(false);
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setAuthed(Boolean(data?.user?.username)))
      .catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <img src="/src/assets/logo.svg" className="h-6 w-6" alt="logo"/>
          <span className="font-semibold">Accounts Vault</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="px-4">
        <Suspense fallback={<div className="animate-pulse p-6">Loading…</div>}>
          {authed ? <List /> : <Login onLoggedIn={() => setAuthed(true)} />}
        </Suspense>
      </main>
      <footer className="text-center text-xs opacity-70 py-6">Local-only • Encrypted at rest</footer>
    </div>
  );
}
