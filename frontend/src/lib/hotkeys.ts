export const bindHotkeys = (map: Record<string, (e: KeyboardEvent) => void>) => {
  const handler = (e: KeyboardEvent) => {
    const key = [];
    if (e.ctrlKey) key.push('Ctrl');
    if (e.metaKey) key.push('Meta');
    if (e.shiftKey) key.push('Shift');
    key.push(e.key.toLowerCase());
    const id = key.join('+');
    const fn = map[id] || map[e.key.toLowerCase()];
    if (fn) {
      fn(e);
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
};
