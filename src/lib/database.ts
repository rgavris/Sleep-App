
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    const sqlite3Verbose = sqlite3.verbose();
    db = await open({
      filename: './sleep.db',
      driver: sqlite3Verbose.Database
    });
    await db.exec('PRAGMA foreign_keys = ON;');
    await db.migrate({
        migrationsPath: './migrations'
    });
  }
  return db;
}
