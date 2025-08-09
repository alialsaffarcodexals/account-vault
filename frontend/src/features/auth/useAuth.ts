export async function fetchCsrf() {
  const res = await fetch('/api/me', { credentials: 'include' });
  const data = await res.json();
  return data.csrfToken as string;
}
export async function login(username: string, password: string) {
  const csrf = await fetchCsrf();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}
export async function register(username: string, password: string) {
  const csrf = await fetchCsrf();
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}
export async function logout() {
  const csrf = await fetchCsrf();
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include', headers: { 'x-csrf-token': csrf } });
}
