import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { fetchMLBTeams } from '../services/api';

interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
}

const Favorites = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      const data = await fetchMLBTeams();
      setTeams(data);
    };

    loadTeams();
  }, []);

  const renderItem = ({ item }: { item: Team }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.strTeamBadge }} style={styles.logo} />
      <Text style={styles.name}>{item.strTeam}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MLB Teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.idTeam}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
  },
});

export default Favorites;
