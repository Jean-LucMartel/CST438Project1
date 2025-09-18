// @ts-check
/** @typedef {import('expo-sqlite').SQLiteDatabase} SQLiteDatabase */

/** @param {SQLiteDatabase} db */
export async function migrate(db) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sanity(x INTEGER);
    `);
  }