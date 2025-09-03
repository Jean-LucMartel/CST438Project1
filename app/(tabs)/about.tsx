import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>About This Project</Text>

      <Text style={styles.body}>
        This app was created by Group 1 for our Android REST API project.{"\n"}
        It displays baseball player data using a public MLB API.
      </Text>

      <Text style={styles.subtitle}>Group Members:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Jose Valdez-Fernandez</Text>
        <Text style={styles.listItem}>• Jean-Luc Martel</Text>
        <Text style={styles.listItem}>• Andrew Arreola</Text>
        <Text style={styles.listItem}>• Elijah Hart</Text>
      </View>
    <br></br>
      <Text style={styles.course}>CST 438: Software Engineering | Fall 2025 </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  course: {
    fontSize: 25,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  body: {
    fontSize: 22,
    lineHeight: 26,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    alignItems: 'flex-start',
  },
  listItem: {
    fontSize: 22,
    lineHeight: 28,
    color: '#555',
  },
});
