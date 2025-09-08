import { Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import PlayerCard from '@/components/PlayerCard'

export default function AboutScreen() {
  return (

    <SafeAreaView style = {styles.safe}>
      <Text style={styles.sectionTitle}>Favorites</Text>
      <ScrollView
          contentContainerStyle = {styles.scrollContent}
          showsVerticalScrollIndicator = {false}
          testID = "favoritesScroll"
          >
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          <PlayerCard title = "Mookie Betts" position = "RF" team = "Dodgers" height = "60"></PlayerCard>
          
      </ScrollView>
    </SafeAreaView>
    
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
  }
});
