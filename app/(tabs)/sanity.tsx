import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { addPlayer, getAllPlayers, getAllTeams } from "../../src/services/db";

export default function Sanity() {
  const db = useSQLiteContext();
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    loadData();
  }, [db]);

  const loadData = async () => {
    try {
      console.log("Testing SQLite operations...");

      // Test getting all players
      const playersData = await getAllPlayers(db);
      setPlayers(playersData);
      console.log("Players loaded:", playersData.length);

      // Test getting all teams
      const teamsData = await getAllTeams(db);
      setTeams(teamsData);
      console.log("Teams loaded:", teamsData.length);

      setStatus(`✅ Database working! Found ${playersData.length} players and ${teamsData.length} teams`);
    } catch (error) {
      console.error("Database error:", error);
      setStatus("❌ Database error: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const testAddPlayer = async () => {
    try {
      const newPlayerId = await addPlayer(db, "Test Player", "Shortstop", "Test Team");
      console.log("Added new player with ID:", newPlayerId);
      await loadData(); // Reload data to show the new player
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SQLite Database Test</Text>
      <Text style={styles.status}>{status}</Text>

      <Pressable style={styles.button} onPress={testAddPlayer}>
        <Text style={styles.buttonText}>Add Test Player</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={loadData}>
        <Text style={styles.buttonText}>Reload Data</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players ({players.length})</Text>
        {players.map((player) => (
          <View key={player.id} style={styles.item}>
            <Text style={styles.itemName}>{player.name}</Text>
            <Text style={styles.itemDetails}>{player.position} - {player.team}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams ({teams.length})</Text>
        {teams.map((team) => (
          <View key={team.id} style={styles.item}>
            <Text style={styles.itemName}>{team.name}</Text>
            <Text style={styles.itemDetails}>{team.city}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#fa5c5c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  item: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#fa5c5c',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
