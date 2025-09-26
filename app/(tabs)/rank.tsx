import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createRankingList, saveRankingListItems, useDb } from '../../lib/db';
import { useFavorites } from '../favorites/FavoritesProvider';

export default function RankScreen() {
  const { favorites } = useFavorites();
  const db = useDb();

  const [selected, setSelected] = useState<string[]>([]); // stores ranked order
  const [rankingTitle, setRankingTitle] = useState('');

  const toggleRank = (id: string) => {
    if (selected.includes(id)) {
      // remove from ranking
      setSelected(selected.filter((x) => x !== id));
    } else {
      // add to ranking (max 10)
      if (selected.length >= 10) {
        Alert.alert('Limit reached', 'You can only rank up to 10 items.');
        return;
      }
      setSelected([...selected, id]);
    }
  };

const saveRanking = async () => {
  if (!rankingTitle.trim()) {
    Alert.alert('Missing title', 'Please enter a ranking name.');
    return;
  }
  if (selected.length === 0) {
    Alert.alert('No ranking', 'Please select at least one favorite.');
    return;
  }

  try {
    const sport = 'mlb'; // replace later if you add multiple sports
    const userId = 1;    // replace with logged-in user id

    // 1. Ensure each selected player exists in the `players` table
    for (const playerId of selected) {
      // look up the player object from favorites
      const fav = Object.values(favorites).find(f => f.idPlayer === playerId);
      if (fav) {
        await db.runAsync(
          `INSERT OR IGNORE INTO players (sport, player_id, first_name, last_name, display_name)
           VALUES (?, ?, ?, ?, ?)`,
          [
            sport,
            fav.idPlayer,
            fav.strPlayer?.split(' ')[0] ?? null, // crude split for first name
            fav.strPlayer?.split(' ').slice(1).join(' ') ?? null, // rest as last name
            fav.strPlayer ?? fav.strTeam ?? null,
          ]
        );
      }
    }

    // 2. Create a new ranking list
    const listId = await createRankingList(db, {
      userId,
      sport,
      title: rankingTitle.trim(),
    });

    // 3. Save ranked items
    const items = selected.map((playerId, idx) => ({
      rank: idx + 1,
      player_id: playerId,
    }));

    await saveRankingListItems(db, listId, sport, items);

    Alert.alert('Success', `Ranking "${rankingTitle}" saved!`);
    setSelected([]);
    setRankingTitle('');
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to save ranking.');
  }
};


  const renderItem = ({ item }: any) => {
    const isRanked = selected.includes(item.idPlayer);
    const rankNumber = selected.indexOf(item.idPlayer) + 1;

    return (
      <TouchableOpacity
        style={[styles.card, isRanked && styles.cardSelected]}
        onPress={() => toggleRank(item.idPlayer)}
      >
        <View style={styles.itemRow}>
          {item.strThumb ? (
            <Image source={{ uri: item.strThumb }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}

          <Text style={styles.name}>
            {item.strPlayer || item.strTeam}
          </Text>
        </View>

        {isRanked && <Text style={styles.rank}>#{rankNumber}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Top 10</Text>
      <Text style={styles.subtitle}>
        Name your ranking and tap items to rank them.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ranking Name"
        value={rankingTitle}
        onChangeText={setRankingTitle}
      />

      <FlatList
        data={Object.values(favorites)}
        keyExtractor={(item) => item.idPlayer}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveRanking}>
        <Text style={styles.saveBtnText}>Save Ranking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardSelected: {
    backgroundColor: '#cce5ff',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  saveBtn: {
    backgroundColor: '#0077cc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 16,
  },
  thumbPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
