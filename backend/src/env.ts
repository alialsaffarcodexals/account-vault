import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const env = {
  PORT: parseInt(process.env.PORT || '5177', 10),
  NODE_ENV: process.env.NODE_ENV || 'production',
  SESSION_NAME: process.env.SESSION_NAME || 'av.sid',
  SESSION_IDLE_MINUTES: parseInt(process.env.SESSION_IDLE_MINUTES || '30', 10),
  SESSION_ABSOLUTE_HOURS: parseInt(process.env.SESSION_ABSOLUTE_HOURS || '8', 10),
  CSRF_COOKIE_NAME: process.env.CSRF_COOKIE_NAME || 'XSRF-TOKEN'
};

export const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function getSessionSecret(): string {
  const p = path.join(DATA_DIR, '.session-secret');
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  const secret = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(p, secret, 'utf8');
  return secret;
}
