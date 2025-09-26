export type RootStackParamList = {
  Favorites: undefined;
  TeamPlayers: {
    teamId: string;
    teamName: string;
  };
};

export interface Team {
  idTeam: string;
  strTeam: string;
  strBadge?: string;
  strDescriptionEN?: string;
  strLeague: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strPosition: string;
  strCutout: string;
  strSport?: string;
}
