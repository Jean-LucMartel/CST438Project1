import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "../auth/AuthProvider"; // 👈 import AuthProvider
import { migrate, repairUsersTable } from "../lib/db";

async function onInit(db: SQLite.SQLiteDatabase) {
  await migrate(db);             
  await repairUsersTable(db);
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="app.db" onInit={onInit}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
