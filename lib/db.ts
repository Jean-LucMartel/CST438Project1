
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";

export type User = { id?: number; username: string; created_at: string };

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
      username TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
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
  `);
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
