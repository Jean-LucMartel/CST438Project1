import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFavorites } from '../favorites/FavoritesProvider'; 

interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb: string;
  strPosition: string;
  strTeam: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const { isFavorite, toggle } = useFavorites();

  const searchPlayers = async () => {
    if (!query) return;
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPlayers(data.player || []);
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a player..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Search" onPress={searchPlayers} />

      <FlatList
        data={players}
        keyExtractor={(item) => item.idPlayer}
        renderItem={({ item }) => {
          const fav = isFavorite(item.idPlayer);
          return (
          <View style={styles.card}>
            {item.strThumb && (
              <Image source={{ uri: item.strThumb }} style={styles.image} />
            )}
            <View style={styles.info}>
              <Text style={styles.name}>{item.strPlayer}</Text>
              <Text>{item.strTeam} — {item.strPosition}</Text>
            </View>
            <View>
              <Button
                  title={fav ? 'Unfavorite' : 'Favorite'}
                  color={fav ? '#555' : '#fa5c5c'}
                  onPress={() =>
                    toggle({
                      idPlayer: item.idPlayer,
                      strPlayer: item.strPlayer,
                      strThumb: item.strThumb,
                      strTeam: item.strTeam,
                      strPosition: item.strPosition,
                    })
                  }
                />
            </View>
          </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e6e6e6ff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});
