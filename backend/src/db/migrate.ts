import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { DATA_DIR } from '../env';

const DB_PATH = path.join(DATA_DIR, 'accounts_vault.sqlite');
export function openDB() {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  return db;
}
export function migrate(db: Database.Database) {
  const schema = fs.readFileSync(path.resolve(__dirname, './schema.sql'), 'utf8');
  db.exec(schema);
}
