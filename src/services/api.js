import axios from 'axios';

export const fetchMLBTeams = async () => {
  try {
    const response = await axios.get(
      'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=MLB'
    );
    const teams = response?.data?.teams;
    return Array.isArray(teams) ? teams : [];
  } catch (error) {
    console.error('❌ Error fetching MLB teams:', error);
    return [];
  }
};
