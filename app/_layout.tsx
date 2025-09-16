import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { migrate, seedExampleMlbPlayers } from "../lib/db";

async function onInit(db: SQLite.SQLiteDatabase) {
  await migrate(db);             
  await seedExampleMlbPlayers(db);
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="app.db" onInit={onInit}>
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
