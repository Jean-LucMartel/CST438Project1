import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getRankingListItems, getRankingLists, useDb } from '../../lib/db';

export default function SavedRankingsScreen() {
  const db = useDb();
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);

  // Reload whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const userId = 1; // replace with logged-in user ID
        const result = await getRankingLists(db, userId);
        setLists(result);
      })();
    }, [db])
  );

  const openList = async (list: any) => {
    setSelectedList(list);
    const result = await getRankingListItems(db, list.id);
    setItems(result);
  };

  if (selectedList) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{selectedList.title}</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => item.player_id}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              #{item.rank} — {item.display_name}
            </Text>
          )}
        />
        <TouchableOpacity onPress={() => setSelectedList(null)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Back to All Rankings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Rankings</Text>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openList(item)} style={styles.listCard}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.sport}>Sport: {item.sport}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  listCard: {
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  listTitle: { fontSize: 18, fontWeight: '600' },
  sport: { fontSize: 14, color: '#555' },
  item: { fontSize: 16, paddingVertical: 6 },
  backBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#0077cc',
    borderRadius: 6,
    alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontWeight: '600' },
});
