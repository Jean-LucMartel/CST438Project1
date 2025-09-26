import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFavorites } from '../favorites/FavoritesProvider';
import { Team } from '../navigation/types';

const sports = ['NFL', 'NBA', 'MLB', 'Soccer', 'NHL'];

export default function TeamsScreen() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { isFavorite, toggle } = useFavorites();

  const fetchTeams = async (sport: string) => {
    let sportQuery = sport;
    if (sport === 'Soccer') sportQuery = 'English Premier League';
    const url = `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(
      sportQuery
    )}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      setTeams(json.teams || []);
      setSelectedSport(sport);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

const renderTeam = ({ item }: { item: Team }) => {
  const fav = isFavorite(item.idTeam);

  return (
    <View style={styles.item}>
      {item.strBadge ? (
        <Image source={{ uri: item.strBadge }} style={styles.logo} />
      ) : (
        <View style={styles.logoPlaceholder} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.strTeam}</Text>

        {/* View Team Background button */}
        <Pressable
          onPress={() => {
            setSelectedTeam(item);
            setModalVisible(true);
          }}
          style={({ pressed }) => [
            styles.bgBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.bgBtnText}>View Team Background</Text>
        </Pressable>

        {/* Favorite / Unfavorite button */}
        <Pressable
          onPress={() =>
            toggle({
              idPlayer: item.idTeam,
              strPlayer: item.strTeam,
              strThumb: item.strBadge,
              strTeam: item.strLeague,
              strPosition: 'Team',
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
    </View>
  );
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Sport</Text>
      <View style={styles.sportButtonContainer}>
        {sports.map((sport) => (
          <TouchableOpacity
            key={sport}
            style={[
              styles.sportButton,
              selectedSport === sport && styles.selectedSportButton,
            ]}
            onPress={() => fetchTeams(sport)}
          >
            <Text
              style={[
                styles.sportButtonText,
                selectedSport === sport && styles.selectedSportButtonText,
              ]}
            >
              {sport}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSport && (
        <>
          <Text style={styles.subTitle}>{selectedSport} Teams</Text>
          <FlatList
            data={teams}
            keyExtractor={(item) => item.idTeam}
            renderItem={renderTeam}
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTeam?.strTeam}</Text>
            <ScrollView style={styles.modalBody}>
              <Text>
                {selectedTeam?.strDescriptionEN || 'No description available.'}
              </Text>
            </ScrollView>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
  },
  sportButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  sportButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSportButton: {
    backgroundColor: '#4A90E2',
  },
  sportButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    marginRight: 12,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  favBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
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
  viewDetails: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBody: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    bgBtn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  bgBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

});
