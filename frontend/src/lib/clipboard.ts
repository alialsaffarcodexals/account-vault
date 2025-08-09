export const copyWithTimeout = async (text: string, timeoutMs = 30_000) => {
  await navigator.clipboard.writeText(text);
  const timer = setTimeout(async () => {
    try {
      // Overwrite clipboard to clear. We can't truly 'clear' for security.
      await navigator.clipboard.writeText('');
    } catch {}
  }, timeoutMs);
  return () => clearTimeout(timer);
};
