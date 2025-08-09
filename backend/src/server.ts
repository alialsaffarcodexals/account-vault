import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { env } from './env';
import { requestLogger } from './utils/logger';
import { helmetMw } from './security/helmet';
import { sessionMw } from './auth/session';
import { ensureCsrf } from './security/csrf';
import { authRoutes } from './auth/routes';
import { requireAuth } from './middleware/requireAuth';
import { itemsRoutes } from './items/routes';
import { exportRoutes } from './export/routes';
import './db'; // open DB & migrate

const app = express();
app.disable('x-powered-by');
app.use(requestLogger);
app.use(helmetMw);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(sessionMw);
app.use(ensureCsrf);

app.get('/api/me', (req, res) => {
  const userId = (req.session as any).userId;
  let username: string | null = null;
  if (userId) {
    const row = (require('./db') as any).db.prepare('SELECT username FROM users WHERE id=?').get(userId) as { username: string } | undefined;
    username = row?.username || null;
  }
  res.json({ user: username ? { id: userId, username } : null, csrfToken: req.cookies[env.CSRF_COOKIE_NAME] });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', requireAuth, itemsRoutes);
app.use('/api', requireAuth, exportRoutes);

// Serve SPA in production
const publicDir = path.resolve(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));

const port = env.PORT;
app.listen(port, () => console.log(`Accounts Vault listening on http://localhost:${port}`));
