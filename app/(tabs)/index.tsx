import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 
import { router } from 'expo-router';
import Button from '@/components/Button'
import PlayerCard from '@/components/PlayerCard'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the baseball app!</Text>
      <View style={styles.footerContainer}>
        <Button label="Start ranking players" onPress={() => router.push("/(tabs)/rank")} />
        <Button label="View Teams" onPress={() => router.push("/(tabs)/teams")}/>
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
  },
  text: {
    color: '#000000ff',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    margin: 40
  },
  footerContainer: {
    alignItems: 'center',
    flex: 2,
  }
});
