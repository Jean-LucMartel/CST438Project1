import PlayerCard from '@/components/PlayerCard';
import { SafeAreaView, ScrollView, StyleSheet, Text, FlatList, Image, View, Button } from 'react-native';
import { useFavorites } from '../favorites/FavoritesProvider'


export default function AboutScreen() {

  const {favorites, remove} = useFavorites();
  const favPlayers = Object.values(favorites);

  if (favPlayers.length === 0) {
    return (
      <View>
        <Text style={styles.sectionTitle}>You haven't added any favorites yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
        contentContainerStyle={{ padding: 16 }}
      data={favPlayers}
      keyExtractor={(p) => p.idPlayer}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {item.strThumb ? (
            <Image source={{ uri: item.strThumb }} style={styles.thumb} />
          ) : <View style={[styles.thumb, {backgroundColor: '#eee'}]} />}

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.strPlayer}</Text>
            <Text style={styles.meta}>{item.strTeam} — {item.strPosition}</Text>
          </View>

          <Button title="Remove" onPress={() => remove(item.idPlayer)} />
        </View>
      )}
    >






    </FlatList>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  text: {
    color: '#000000ff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  name: { fontWeight: '600' },
  meta: { color: '#666', marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666' },
});