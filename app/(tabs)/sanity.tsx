import { useEffect } from "react";
import { View, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

export default function Sanity() {
  const db = useSQLiteContext();
  useEffect(() => {
    (async () => {
      console.log("execAsync ok?", typeof db.execAsync === "function");
      await db.execAsync("CREATE TABLE IF NOT EXISTS sanity(x INTEGER);");
      console.log("SQLite up ✅");
    })();
  }, [db]);
  return <View style={{ padding: 16 }}><Text>SQLite Sanity Check</Text></View>;
}
