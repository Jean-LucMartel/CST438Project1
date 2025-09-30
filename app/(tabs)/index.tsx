import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth/AuthProvider'; // 👈 import useAuth

export default function Index() {
  const { logout } = useAuth();  // 👈 grab logout function

  return (
    <View style={styles.container}>
      <Text style={styles.title}> SportsHub 🏆</Text>
      <Text style={styles.subtitle}>Your all-in-one sports companion</Text>

      <View style={styles.grid}>
        {/* Search Players */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search" size={40} color="#fff" />
          <Text style={styles.cardText}>Search Players</Text>
        </TouchableOpacity>

        {/* View Teams */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/teams')}
        >
          <MaterialIcons name="group" size={40} color="#fff" />
          <Text style={styles.cardText}>View Teams</Text>
        </TouchableOpacity>

        {/* Rankings */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/rank')}
        >
          <FontAwesome5 name="trophy" size={40} color="#fff" />
          <Text style={styles.cardText}>Rankings</Text>
        </TouchableOpacity>

        {/* Favorites */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/favorites')}
        >
          <Ionicons name="star" size={40} color="#fff" />
          <Text style={styles.cardText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#0077cc',
    width: 140,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    elevation: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#cc0000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
