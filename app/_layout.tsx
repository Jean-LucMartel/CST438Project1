import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrate } from '../src/services/db';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={migrate}>
      <Stack />
    </SQLiteProvider>
  );
}