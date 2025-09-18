import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Button as RNButton } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useDb, getFavoritedPlayersBySport, createRankingList, saveRankingListItems, type FavPlayer } from "@/lib/db";

// TODO: wire this to real auth
const getCurrentUserId = async () => 1;

const RANKS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function CreateTopTenScreen() {
  const db = useDb();
  const [sport, setSport] = useState<"mlb" | "nba" | "nfl" | "nhl" | string>("mlb");
  const [title, setTitle] = useState("My Top 10");
  const [favorites, setFavorites] = useState<FavPlayer[]>([]);
  const [selected, setSelected] = useState<(string | null)[]>(RANKS.map(() => null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const userId = await getCurrentUserId();
        const favs = await getFavoritedPlayersBySport(db, userId, sport);
        setFavorites(favs);
        // Clear selections when sport changes
        setSelected(RANKS.map(() => null));
      } finally {
        setLoading(false);
      }
    })();
  }, [db, sport]);

  const chosenIds = useMemo(() => new Set(selected.filter(Boolean) as string[]), [selected]);

  function setRank(rankIndex: number, playerId: string | null) {
    setSelected((prev) => {
      const next = [...prev];
      next[rankIndex] = playerId;
      return next;
    });
  }

  function optionsForRank(rankIndex: number) {
    const keepId = selected[rankIndex]; // allow keeping the existing choice
    return favorites.filter((p) => p.player_id === keepId || !chosenIds.has(p.player_id));
  }

  async function handleSave() {
    const userId = await getCurrentUserId();
    if (!title.trim()) {
      Alert.alert("Add a title", "Please enter a title for your Top 10 list.");
      return;
    }
    // Require all ranks to be chosen; change if you want partial saves
    if (selected.some((v) => !v)) {
      Alert.alert("Select all ranks", "Please select a player for each ranking 1 through 10.");
      return;
    }
    const items = selected.map((player_id, i) => ({ rank: i + 1, player_id: player_id! }));

    try {
      setLoading(true);
      const listId = await createRankingList(db, { userId, sport, title: title.trim() });
      await saveRankingListItems(db, listId, sport, items);
      Alert.alert("Saved!", "Your Top 10 has been saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Create Top 10</Text>

      
      <View style={styles.row}>
        <Text style={styles.label}>Sport</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={sport} onValueChange={(v) => setSport(v)}>
            <Picker.Item label="MLB" value="mlb" />
            <Picker.Item label="NBA" value="nba" />
            <Picker.Item label="NFL" value="nfl" />
            <Picker.Item label="NHL" value="nhl" />
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="My Top 10"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={{ height: 8 }} />

      {RANKS.map((rank, i) => (
        <View key={rank} style={styles.rankRow}>
          <Text style={styles.rankNum}>{rank}</Text>
          <View style={styles.pickerWrap}>
            <Picker
              enabled={!loading && favorites.length > 0}
              selectedValue={selected[i]}
              onValueChange={(val) => setRank(i, val)}
            >
              <Picker.Item label="-- Select player --" value={null as any} />
              {optionsForRank(i).map((p) => (
                <Picker.Item key={p.player_id} label={p.display_name ?? p.player_id} value={p.player_id} />
              ))}
            </Picker>
          </View>
        </View>
      ))}

      <View style={{ height: 12 }} />
      <RNButton title={loading ? "Saving..." : "Save Top 10"} disabled={loading} onPress={handleSave} />
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  h1: { fontSize: 24, fontWeight: "800", textAlign: "center", marginVertical: 8 },
  row: { gap: 6 },
  label: { fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, padding: 10, backgroundColor: "#fff" },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  rankNum: { width: 28, textAlign: "center", fontWeight: "800", fontSize: 16 },
  pickerWrap: { flex: 1, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, overflow: "hidden", backgroundColor: "#fff" },
});
