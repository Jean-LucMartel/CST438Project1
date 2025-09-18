// @ts-check
/** @typedef {import('expo-sqlite').SQLiteDatabase} SQLiteDatabase */

/** @param {SQLiteDatabase} db */
export async function migrate(db) {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        -- Create a test table for players
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          team TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create a test table for teams
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
  
    // Insert some dummy data
    await insertDummyData(db);
  }
  
  /** @param {SQLiteDatabase} db */
  async function insertDummyData(db) {
    // Check if data already exists
    const playerCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM players');
    const teamCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM teams');
  
    // Only insert if tables are empty
    if (playerCount.count === 0) {
      await db.runAsync(`
        INSERT INTO players (name, position, team) VALUES 
          ('Mike Trout', 'Outfielder', 'Los Angeles Angels'),
          ('Aaron Judge', 'Outfielder', 'New York Yankees'),
          ('Mookie Betts', 'Outfielder', 'Los Angeles Dodgers'),
          ('Freddie Freeman', 'First Base', 'Los Angeles Dodgers'),
          ('Ronald Acuña Jr.', 'Outfielder', 'Atlanta Braves')
      `);
    }
  
    if (teamCount.count === 0) {
      await db.runAsync(`
        INSERT INTO teams (name, city) VALUES 
          ('Angels', 'Los Angeles'),
          ('Yankees', 'New York'),
          ('Dodgers', 'Los Angeles'),
          ('Braves', 'Atlanta'),
          ('Red Sox', 'Boston')
      `);
    }
  }
  
  /** @param {SQLiteDatabase} db */
  export async function getAllPlayers(db) {
    return await db.getAllAsync('SELECT * FROM players ORDER BY name');
  }
  
  /** @param {SQLiteDatabase} db */
  export async function getAllTeams(db) {
    return await db.getAllAsync('SELECT * FROM teams ORDER BY name');
  }
  
  /**
   * @param {SQLiteDatabase} db
   * @param {number} id
   */
  export async function getPlayerById(db, id) {
    return await db.getFirstAsync('SELECT * FROM players WHERE id = ?', [id]);
  }
  
  /**
   * @param {SQLiteDatabase} db
   * @param {string} name
   * @param {string} position
   * @param {string} team
   */
  export async function addPlayer(db, name, position, team) {
    const result = await db.runAsync(
      'INSERT INTO players (name, position, team) VALUES (?, ?, ?)',
      [name, position, team]
    );
    return result.lastInsertRowId;
  }