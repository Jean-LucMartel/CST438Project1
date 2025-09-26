import * as Crypto from "expo-crypto";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";

export type User = {
  id?: number;
  username: string;
  created_at: string;
  email?: string | null;
  auth_token?: string | null;
};

export function useDb() {
  return useSQLiteContext();
}

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    /* existing users table */
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    email         TEXT UNIQUE,
    password_hash TEXT,
    auth_token    TEXT UNIQUE,
    created_at    TEXT NOT NULL
  );

    /* MLB tables */
    CREATE TABLE IF NOT EXISTS mlb_teams (
      team_id    INTEGER PRIMARY KEY,         -- e.g. 121
      team_code  TEXT,                         -- e.g. "nyn"
      team_abbrev TEXT,                        -- e.g. "NYM"
      team_full  TEXT,                         -- e.g. "New York Mets"
      league     TEXT,                         -- e.g. "NL"
      sport_code TEXT                          -- e.g. "mlb"
    );

    CREATE TABLE IF NOT EXISTS mlb_players (
      player_id   INTEGER PRIMARY KEY,          -- e.g. 493316
      name_first  TEXT,
      name_last   TEXT,
      name_use    TEXT,
      name_display_first_last TEXT,
      name_display_last_first TEXT,
      name_display_roster TEXT,
      birth_country TEXT,
      birth_state   TEXT,
      birth_city    TEXT,
      birth_date    TEXT,                       -- ISO string
      bats          TEXT,                       -- "R" | "L" | "S"
      throws        TEXT,                       -- "R" | "L"
      height_feet   INTEGER,
      height_inches INTEGER,
      weight        INTEGER,
      pro_debut_date TEXT,                      -- ISO string
      high_school   TEXT,
      college       TEXT,
      active_sw     TEXT,                       -- "Y"/"N"
      position      TEXT,                       -- "LF"
      position_id   INTEGER,                    -- 7
      team_id       INTEGER REFERENCES mlb_teams(team_id)
    );

    CREATE INDEX IF NOT EXISTS idx_mlb_players_team_id ON mlb_players(team_id);
    CREATE INDEX IF NOT EXISTS idx_mlb_players_last_first ON mlb_players(name_last, name_first);

    /* Sports catalog (optional) */
  CREATE TABLE IF NOT EXISTS sports (
    code TEXT PRIMARY KEY,         -- e.g. 'mlb', 'nba'
    name TEXT
  );

  /* Generic players table (works for any sport) */
  CREATE TABLE IF NOT EXISTS players (
    sport     TEXT NOT NULL,
    player_id TEXT NOT NULL,       -- keep as TEXT to handle non-numeric ids
    first_name TEXT,
    last_name  TEXT,
    display_name TEXT,
    position   TEXT,
    team_id    TEXT,
    active_sw  TEXT,
    PRIMARY KEY (sport, player_id)
  );

  /* Favorites per user & sport */
  CREATE TABLE IF NOT EXISTS favorites (
    user_id   INTEGER NOT NULL,
    sport     TEXT NOT NULL,
    player_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, sport, player_id),
    FOREIGN KEY (sport, player_id) REFERENCES players (sport, player_id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_favorites_user_sport ON favorites(user_id, sport);

  /* Ranking lists (one per save) */
  CREATE TABLE IF NOT EXISTS ranking_lists (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    sport     TEXT NOT NULL,
    title     TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  /* Exactly-ranked items 1..10 for a list */
  CREATE TABLE IF NOT EXISTS ranking_list_items (
    list_id   INTEGER NOT NULL,
    rank      INTEGER NOT NULL,     -- 1..10
    sport     TEXT NOT NULL,
    player_id TEXT NOT NULL,
    PRIMARY KEY (list_id, rank),
    UNIQUE (list_id, sport, player_id),
    FOREIGN KEY (list_id) REFERENCES ranking_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (sport, player_id) REFERENCES players(sport, player_id)
  );
  `);
  await patchAuthColumns(db);
}

async function columnExists(db: SQLiteDatabase, table: string, column: string) {
  const rows = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table});`);
  return rows.some((r) => r.name === column);
}

async function addColumnIfMissing(
  db: SQLiteDatabase,
  table: string,
  column: string,
  decl: string
) {
  if (!(await columnExists(db, table, column))) {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${decl};`);
  }
}

export async function patchAuthColumns(db: SQLiteDatabase) {
  await addColumnIfMissing(db, "users", "email", "TEXT");
  await addColumnIfMissing(db, "users", "password_hash", "TEXT");
  await addColumnIfMissing(db, "users", "auth_token", "TEXT");

  await db.execAsync(`
    CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users(email);
    CREATE UNIQUE INDEX IF NOT EXISTS ux_users_auth_token ON users(auth_token);
  `);
}

const normalizeEmail = (e: string) => e.trim().toLowerCase();

export async function generateAuthToken(length = 32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = await Crypto.getRandomBytesAsync(length);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

async function hashPassword(password: string, salt?: string) {
  const s = salt ?? (await generateAuthToken(16));
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    s + password
  );
  return `${s}$${digest}`;
}

async function verifyPassword(stored: string | null, password: string) {
  if (!stored) return false;
  const [salt, hash] = stored.split("$");
  const check = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + password
  );
  return check === hash;
}



export async function getUserByUsername(
  db: SQLiteDatabase,
  username: string
): Promise<User | null> {
  const row = await db.getFirstAsync<User>(
    `SELECT id, username, created_at FROM users WHERE username = ?`,
    [username]
  );
  return row ?? null;
}

export async function repairUsersTable(db: SQLiteDatabase) {

  const cols = await db.getAllAsync<{ name: string; notnull: number }>(`PRAGMA table_info(users);`);
  const hasPassword = cols.some(c => c.name === "password");
  const hasPasswordHash = cols.some(c => c.name === "password_hash");
  const hasEmail = cols.some(c => c.name === "email");
  const hasAuth = cols.some(c => c.name === "auth_token");
  const hasCreatedAt = cols.some(c => c.name === "created_at");


  if (!hasPassword && hasPasswordHash && hasEmail && hasAuth && hasCreatedAt) return;

  await db.execAsync(`
    BEGIN TRANSACTION;

    CREATE TABLE IF NOT EXISTS users_tmp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username     TEXT NOT NULL UNIQUE,
      email        TEXT UNIQUE,
      password_hash TEXT,             -- nullable to allow migration; app enforces writing it
      auth_token    TEXT UNIQUE,
      created_at    TEXT NOT NULL
    );

    INSERT INTO users_tmp (id, username, email, password_hash, auth_token, created_at)
      SELECT
        id,
        username,
        ${hasEmail ? "email" : "NULL"} AS email,
        ${hasPasswordHash ? "password_hash" : hasPassword ? "password" : "NULL"} AS password_hash,
        ${hasAuth ? "auth_token" : "NULL"} AS auth_token,
        ${hasCreatedAt ? "created_at" : "CURRENT_TIMESTAMP"} AS created_at
      FROM users;

    DROP TABLE users;
    ALTER TABLE users_tmp RENAME TO users;

    CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users(email);
    CREATE UNIQUE INDEX IF NOT EXISTS ux_users_auth_token ON users(auth_token);

    COMMIT;
  `);
}

export async function createUserWithPassword(
  db: SQLiteDatabase,
  { username, email, password }: { username: string; email: string; password: string }
): Promise<User> {
  const created_at = new Date().toISOString();
  const password_hash = await hashPassword(password);
  const auth_token = await generateAuthToken();
  const emailNorm = normalizeEmail(email);

  await db.runAsync(
    `INSERT INTO users (username, created_at, email, password_hash, auth_token)
     VALUES (?, ?, ?, ?, ?)`,
    [username, created_at, emailNorm, password_hash, auth_token]
  );

  const row = await db.getFirstAsync<User>(
    `SELECT id, username, created_at, email, auth_token FROM users WHERE email = ?`,
    [emailNorm]
  );

  if (!row) throw new Error("Failed to create user");
  return row;
}

export async function loginWithEmailPassword(
  db: SQLiteDatabase,
  email: string,
  password: string
): Promise<User | null> {
  const emailNorm = normalizeEmail(email);
  const row = await db.getFirstAsync<{
    id: number;
    username: string;
    created_at: string;
    email: string | null;
    password_hash: string | null;
    auth_token: string | null;
  }>(`SELECT * FROM users WHERE email = ?`, [emailNorm]);

  if (!row) return null;
  const ok = await verifyPassword(row.password_hash, password);
  if (!ok) return null;

  if (!row.auth_token) {
    row.auth_token = await generateAuthToken();
    await db.runAsync(`UPDATE users SET auth_token = ? WHERE id = ?`, [
      row.auth_token,
      row.id,
    ]);
  }

  return {
    id: row.id,
    username: row.username,
    created_at: row.created_at,
    email: row.email,
    auth_token: row.auth_token,
  };
}


export type MlbTeam = {
  team_id: number;
  team_code?: string | null;
  team_abbrev?: string | null;
  team_full?: string | null;
  league?: string | null;
  sport_code?: string | null;
};

export type MlbPlayer = {
  player_id: number;
  name_first?: string | null;
  name_last?: string | null;
  name_use?: string | null;
  name_display_first_last?: string | null;
  name_display_last_first?: string | null;
  name_display_roster?: string | null;
  birth_country?: string | null;
  birth_state?: string | null;
  birth_city?: string | null;
  birth_date?: string | null;
  bats?: string | null;
  throws?: string | null;
  height_feet?: number | null;
  height_inches?: number | null;
  weight?: number | null;
  pro_debut_date?: string | null;
  high_school?: string | null;
  college?: string | null;
  active_sw?: string | null;
  position?: string | null;
  position_id?: number | null;
  team_id?: number | null;
};

export type MlbApiRow = {
  position?: string;
  birth_country?: string;
  weight?: string;
  birth_state?: string;
  name_display_first_last?: string;
  college?: string;
  height_inches?: string;
  name_display_roster?: string;
  sport_code?: string;
  bats?: string;
  name_first?: string;
  team_code?: string;
  birth_city?: string;
  height_feet?: string;
  pro_debut_date?: string;
  team_full?: string;
  team_abbrev?: string;
  birth_date?: string;
  throws?: string;
  league?: string;
  name_display_last_first?: string;
  position_id?: string;
  high_school?: string;
  name_use?: string;
  player_id: string;
  name_last?: string;
  team_id?: string;
  service_years?: string;
  active_sw?: string;
};

export type FavPlayer = { player_id: string; display_name: string };

export async function getFavoritedPlayersBySport(
  db: SQLiteDatabase,
  userId: number,
  sport: string
): Promise<FavPlayer[]> {
  return db.getAllAsync<FavPlayer>(
    `SELECT p.player_id, COALESCE(p.display_name, TRIM(p.first_name||' '||p.last_name)) as display_name
     FROM favorites f
     JOIN players p ON p.sport = f.sport AND p.player_id = f.player_id
     WHERE f.user_id = ? AND f.sport = ?
     ORDER BY display_name COLLATE NOCASE`,
    [userId, sport]
  );
}

export async function createRankingList(
  db: SQLiteDatabase,
  { userId, sport, title }: { userId: number; sport: string; title: string }
): Promise<number> {
  await db.runAsync(
    `INSERT INTO ranking_lists (user_id, sport, title) VALUES (?, ?, ?)`,
    [userId, sport, title]
  );
  const row = await db.getFirstAsync<{ id: number }>(`SELECT last_insert_rowid() as id`);
  return row!.id;
}

export async function saveRankingListItems(
  db: SQLiteDatabase,
  listId: number,
  sport: string,
  items: Array<{ rank: number; player_id: string }>
) {
  await db.execAsync(`UPDATE ranking_lists SET updated_at = strftime('%s','now') WHERE id = ${listId};`);
  await db.execAsync(`DELETE FROM ranking_list_items WHERE list_id = ${listId};`);
  const stmt = `INSERT INTO ranking_list_items (list_id, rank, sport, player_id) VALUES (?, ?, ?, ?)`;
  for (const it of items) {
    await db.runAsync(stmt, [listId, it.rank, sport, it.player_id]);
  }
}


const toInt = (s?: string | null) =>
  s && s.trim() !== "" ? Number.parseInt(s, 10) : null;

const toISOorNull = (s?: string | null) =>
  s && s.trim() !== "" ? new Date(s).toISOString() : null;

export async function upsertMlbTeamFromApiRow(db: SQLiteDatabase, row: MlbApiRow) {
  const team_id = toInt(row.team_id ?? null);
  if (!team_id) return;

  await db.runAsync(
    `INSERT INTO mlb_teams (team_id, team_code, team_abbrev, team_full, league, sport_code)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(team_id) DO UPDATE SET
       team_code=excluded.team_code,
       team_abbrev=excluded.team_abbrev,
       team_full=excluded.team_full,
       league=excluded.league,
       sport_code=excluded.sport_code`,
    [
      team_id,
      row.team_code ?? null,
      row.team_abbrev ?? null,
      row.team_full ?? null,
      row.league ?? null,
      row.sport_code ?? null,
    ]
  );
}

export async function upsertMlbPlayerFromApiRow(db: SQLiteDatabase, row: MlbApiRow) {
  await upsertMlbTeamFromApiRow(db, row);

  const player_id = toInt(row.player_id);
  if (!player_id) throw new Error("API row missing player_id");

  await db.runAsync(
    `INSERT INTO mlb_players (
      player_id, name_first, name_last, name_use,
      name_display_first_last, name_display_last_first, name_display_roster,
      birth_country, birth_state, birth_city, birth_date,
      bats, throws,
      height_feet, height_inches, weight,
      pro_debut_date, high_school, college,
      active_sw, position, position_id,
      team_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(player_id) DO UPDATE SET
      name_first=excluded.name_first,
      name_last=excluded.name_last,
      name_use=excluded.name_use,
      name_display_first_last=excluded.name_display_first_last,
      name_display_last_first=excluded.name_display_last_first,
      name_display_roster=excluded.name_display_roster,
      birth_country=excluded.birth_country,
      birth_state=excluded.birth_state,
      birth_city=excluded.birth_city,
      birth_date=excluded.birth_date,
      bats=excluded.bats,
      throws=excluded.throws,
      height_feet=excluded.height_feet,
      height_inches=excluded.height_inches,
      weight=excluded.weight,
      pro_debut_date=excluded.pro_debut_date,
      high_school=excluded.high_school,
      college=excluded.college,
      active_sw=excluded.active_sw,
      position=excluded.position,
      position_id=excluded.position_id,
      team_id=excluded.team_id`,
    [
      player_id,
      row.name_first ?? null,
      row.name_last ?? null,
      row.name_use ?? null,
      row.name_display_first_last ?? null,
      row.name_display_last_first ?? null,
      row.name_display_roster ?? null,
      row.birth_country ?? null,
      row.birth_state ?? null,
      row.birth_city ?? null,
      toISOorNull(row.birth_date),
      row.bats ?? null,
      row.throws ?? null,
      toInt(row.height_feet ?? null),
      toInt(row.height_inches ?? null),
      toInt(row.weight ?? null),
      toISOorNull(row.pro_debut_date),
      row.high_school ?? null,
      row.college ?? null,
      row.active_sw ?? null,
      row.position ?? null,
      toInt(row.position_id ?? null),
      toInt(row.team_id ?? null),
    ]
  );
}

export async function getMlbPlayerById(
  db: SQLiteDatabase,
  playerId: number
): Promise<(MlbPlayer & { team?: MlbTeam | null }) | null> {
  const player = await db.getFirstAsync<MlbPlayer>(
    `SELECT * FROM mlb_players WHERE player_id = ?`,
    [playerId]
  );
  if (!player) return null;

  const team = player.team_id
    ? await db.getFirstAsync<MlbTeam>(
        `SELECT * FROM mlb_teams WHERE team_id = ?`,
        [player.team_id]
      )
    : null;

  return { ...player, team: team ?? null };
}

export async function searchMlbPlayersByName(
  db: SQLiteDatabase,
  q: string,
  limit = 20
): Promise<MlbPlayer[]> {
  const like = `%${q}%`;
  return db.getAllAsync<MlbPlayer>(
    `SELECT * FROM mlb_players
     WHERE name_last LIKE ? OR name_first LIKE ? OR name_display_first_last LIKE ?
     ORDER BY name_last, name_first
     LIMIT ?`,
    [like, like, like, limit]
  );
}

export async function getRankingLists(db: SQLiteDatabase, userId: number) {
  return db.getAllAsync<{ id: number; title: string; sport: string; created_at: number; updated_at: number }>(
    `SELECT id, title, sport, created_at, updated_at 
     FROM ranking_lists
     WHERE user_id = ?
     ORDER BY updated_at DESC`,
    [userId]
  );
}

export async function getRankingListItems(db: SQLiteDatabase, listId: number) {
  return db.getAllAsync<{
    rank: number;
    player_id: string;
    display_name: string;
  }>(
    `SELECT r.rank, r.player_id,
            COALESCE(p.display_name, TRIM(p.first_name||' '||p.last_name)) as display_name
     FROM ranking_list_items r
     JOIN players p ON p.sport = r.sport AND p.player_id = r.player_id
     WHERE r.list_id = ?
     ORDER BY r.rank ASC`,
    [listId]
  );
}


export async function seedExampleMlbPlayers(db: SQLiteDatabase) {
  const sample: MlbApiRow = {
    position: "LF",
    birth_country: "Cuba",
    weight: "220",
    birth_state: "",
    name_display_first_last: "Yoenis Cespedes",
    college: "",
    height_inches: "10",
    name_display_roster: "Cespedes, Y",
    sport_code: "mlb",
    bats: "R",
    name_first: "Yoenis",
    team_code: "nyn",
    birth_city: "Granma",
    height_feet: "5",
    pro_debut_date: "2012-03-28T00:00:00",
    team_full: "New York Mets",
    team_abbrev: "NYM",
    birth_date: "1985-10-18T00:00:00",
    throws: "R",
    league: "NL",
    name_display_last_first: "Cespedes, Yoenis",
    position_id: "7",
    high_school: "",
    name_use: "Yoenis",
    player_id: "493316",
    name_last: "Cespedes",
    team_id: "121",
    service_years: "",
    active_sw: "Y",
  };

  await upsertMlbPlayerFromApiRow(db, sample);
}