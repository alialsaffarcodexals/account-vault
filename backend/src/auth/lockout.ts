import type { Database } from 'better-sqlite3';
const LOCK_MAX = 5;
const LOCK_MS = 15 * 60_000;

export function recordLoginFailure(db: Database, username: string) {
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username) as any;
  if (!user) return;
  const now = Date.now();
  let failed = (user.failed_logins ?? 0) + 1;
  let locked_until = user.locked_until;
  if (failed >= LOCK_MAX) {
    locked_until = now + LOCK_MS;
    failed = 0;
  }
  db.prepare('UPDATE users SET failed_logins=?, locked_until=?, updatedAt=datetime("now") WHERE id=?')
    .run(failed, locked_until, user.id);
}
export function clearLoginFailures(db: Database, userId: number) {
  db.prepare('UPDATE users SET failed_logins=0, locked_until=NULL, updatedAt=datetime("now") WHERE id=?').run(userId);
}
export function isLocked(user: any): boolean {
  if (!user?.locked_until) return false;
  return Date.now() < user.locked_until;
}
