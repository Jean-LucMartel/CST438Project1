import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteRankingList, getRankingListItems, getRankingLists, useDb } from '../../lib/db';

export default function SavedRankingsScreen() {
  const db = useDb();
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const refreshLists = useCallback(async () => {
    const userId = 1; // replace with logged-in user ID
    const result = await getRankingLists(db, userId);
    setLists(result);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      refreshLists();
    }, [refreshLists])
  );

  const openList = async (list: any) => {
    setSelectedList(list);
    const result = await getRankingListItems(db, list.id);
    setItems(result);
  };

  const removeList = async (listId: number) => {
    Alert.alert(
      'Delete Ranking',
      'Are you sure you want to delete this ranking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRankingList(db, listId);
            setSelectedList(null);
            await refreshLists();
          },
        },
      ]
    );
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
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => setSelectedList(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeList(selectedList.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backBtn: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#0077cc',
    borderRadius: 6,
    alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontWeight: '600' },
  deleteBtn: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#cc0000',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#fff', fontWeight: '600' },
});
