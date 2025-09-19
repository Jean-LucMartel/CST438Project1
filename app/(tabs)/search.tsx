import React, { useState } from 'react';
import {
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFavorites } from '../favorites/FavoritesProvider';

interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb: string;
  strPosition: string;
  strTeam: string;
  strNationality?: string;
  strSport?: string;
  strStatus?: string;
  dateBorn?: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { isFavorite, toggle } = useFavorites();

  const searchPlayers = async () => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setPlayers(data.player || []);
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const openModal = (player: Player) => {
    setSelectedPlayer(player);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
    setModalVisible(false);
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
            <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
              {item.strThumb && (
                <Image source={{ uri: item.strThumb }} style={styles.image} />
              )}
              <View style={styles.info}>
                <Text style={styles.name}>{item.strPlayer}</Text>
                <Text>
                  {item.strTeam} — {item.strPosition}
                </Text>

                <Pressable
                  onPress={() =>
                    toggle({
                      idPlayer: item.idPlayer,
                      strPlayer: item.strPlayer,
                      strThumb: item.strThumb,
                      strTeam: item.strTeam,
                      strPosition: item.strPosition,
                    })
                  }
                  style={({ pressed }) => [
                    styles.favBtn,
                    fav ? styles.favBtnOn : styles.favBtnOff,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.favBtnText}>
                    {fav ? 'Unfavorite' : 'Favorite'}
                  </Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPlayer?.strThumb && (
              <Image
                source={{ uri: selectedPlayer.strThumb }}
                style={styles.modalImage}
              />
            )}
            <Text style={styles.modalName}>{selectedPlayer?.strPlayer}</Text>
            <Text style={styles.modalText}>Team: {selectedPlayer?.strTeam}</Text>
            <Text style={styles.modalText}>
              Position: {selectedPlayer?.strPosition}
            </Text>
            {selectedPlayer?.strNationality && (
              <Text style={styles.modalText}>
                Nationality: {selectedPlayer.strNationality}
              </Text>
            )}
            {selectedPlayer?.strSport && (
              <Text style={styles.modalText}>Sport: {selectedPlayer.strSport}</Text>
            )}
            {selectedPlayer?.strStatus && (
              <Text style={styles.modalText}>Status: {selectedPlayer.strStatus}</Text>
            )}
            {selectedPlayer?.dateBorn && (
              <Text style={styles.modalText}>Born: {selectedPlayer.dateBorn}</Text>
            )}
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 120,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 16,
  },
  modalName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 6,
  },
  favBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  favBtnOn: {
    backgroundColor: '#030202ff',
  },
  favBtnOff: {
    backgroundColor: '#fa5c5c',
  },
  favBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
