import { Stack } from 'expo-router';
import { SQLiteProvider } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { migrate, seedExampleMlbPlayers } from "../lib/db";

async function onInit(db: SQLite.SQLiteDatabase) {
  await migrate(db);
  await seedExampleMlbPlayers(db);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={migrate}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}

