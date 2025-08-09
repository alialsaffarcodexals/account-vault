import { openDB, migrate } from './migrate';
export const db = openDB();
migrate(db);
