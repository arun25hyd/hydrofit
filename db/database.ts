import * as SQLite from 'expo-sqlite';
import { ALL_TABLES } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('hydrofit.db');
  await initTables(_db);
  return _db;
}

async function initTables(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  for (const sql of ALL_TABLES) {
    await db.execAsync(sql);
  }
}

export async function isSeeded(db: SQLite.SQLiteDatabase): Promise<boolean> {
  const hf = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM hose_fittings'
  );
  const ho = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM hoses'
  );
  // Re-seed if hoses table has sample data only (< 10 rows)
  return (hf?.count ?? 0) > 0 && (ho?.count ?? 0) >= 10;
}
