import session from 'express-session';
// @ts-ignore – no types for this package version
import ConnectSqlite from 'better-sqlite3-session-store';
import path from 'path';
import { DATA_DIR, env, getSessionSecret } from '../env';

const SQLiteStore = ConnectSqlite(session as any);
export const sessionMw = session({
  name: env.SESSION_NAME,
  secret: getSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: env.SESSION_IDLE_MINUTES * 60 * 1000 },
  rolling: true,
  store: new SQLiteStore({ path: path.join(DATA_DIR, 'sessions.sqlite'), ttl: env.SESSION_ABSOLUTE_HOURS * 3600 })
});
