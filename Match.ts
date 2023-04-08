export type Player = {
  class: string; // "1",
  glbrksavepct: string; // "0.00",
  glbrksaves: string; // "0",
  glbrkshots: string; // "0",
  gldsaves: string; // "0",
  glga: string; // "0",
  glgaa: string; // "0.00",
  glpensavepct: string; // "0.00",
  glpensaves: string; // "0",
  glpenshots: string; // "0",
  glpkclearzone: string; // "0",
  glpokechecks: string; // "0",
  glsavepct: string; // "0.00",
  glsaves: string; // "0",
  glshots: string; // "0",
  glsoperiods: string; // "0",
  isGuest: string; // "1",
  memberString: string; // "6 / 6",
  opponentClubId: string; // "106991",
  opponentScore: string; // "5",
  player_dnf: string; // "0",
  playerLevel: string; // "162",
  pNhlOnlineGameType: string; // "5",
  position: string; // "leftWing",
  posSorted: string; // "4",
  rankpoints: string; // "--",
  ranktierassetid: string; // "0",
  ratingDefense: string; // "100.00",
  ratingOffense: string; // "100.00",
  ratingTeamplay: string; // "10.00",
  removedReason: string; // "6",
  result: string; // "6",
  score: string; // "4",
  scoreRaw: string; // "4",
  scoreString: string; // "4 - 5",
  skassists: string; // "3",
  skbs: string; // "1",
  skdeflections: string; // "0",
  skfol: string; // "0",
  skfopct: string; // "0.00",
  skfow: string; // "0",
  skgiveaways: string; // "23",
  skgoals: string; // "0",
  skgwg: string; // "0",
  skhits: string; // "2",
  skinterceptions: string; // "19",
  skpassattempts: string; // "63",
  skpasses: string; // "44",
  skpasspct: string; // "69.84",
  skpenaltiesdrawn: string; // "1",
  skpim: string; // "8",
  skpkclearzone: string; // "1",
  skplusmin: string; // "1",
  skpossession: string; // "621",
  skppg: string; // "0",
  sksaucerpasses: string; // "1",
  skshg: string; // "0",
  skshotattempts: string; // "2",
  skshotonnetpct: string; // "50.00",
  skshotpct: string; // "0.00",
  skshots: string; // "1",
  sktakeaways: string; // "8",
  teamSide: string; // "1",
  toi: string; // "125",
  toiseconds: string; // "7482",
  playername: string; // "Barnabas_5"
};

export type Club = {
  clubDivision: string; // "8",
  cNhlOnlineGameType: string; // "5",
  garaw: string; // "5",
  gfraw: string; // "4",
  losses: string; // "0",
  memberString: string; // "6 / 6",
  opponentClubId: string; // "106991",
  opponentScore: string; // "5",
  opponentTeamArtAbbr: string; // "EASHL",
  passa: string; // "243",
  passc: string; // "173",
  ppg: string; // "0",
  ppo: string; // "6",
  result: string; // "6",
  score: string; // "4",
  scoreString: string; // "4 - 5",
  shots: string; // "12",
  teamArtAbbr: string; // "DROP",
  teamSide: string; // "1",
  toa: string; // "718",
  winnerByDnf: string; // "0",
  winnerByGoalieDnf: string; // "0",
  details: {
    name: string; // "NoMaDiC WiLDCaTS oRDeR",
    clubId: number; // 106367,
    regionId: number; // 2,
    teamId: number; // 5139,
    customKit: {
      isCustomTeam: string; // "1",
      crestAssetId: string; // "33",
      useBaseAsset: string; // "1"
    };
  };
  goals: string; // "4",
  goalsAgainst: string; // "5"
};

export type Aggregate = {
  class: number; // 53,
  glbrksavepct: number; // 1,
  glbrksaves: number; // 3,
  glbrkshots: number; // 3,
  gldsaves: number; // 1,
  glga: number; // 5,
  glgaa: number; // 2.27,
  glpensavepct: number; // 0,
  glpensaves: number; // 0,
  glpenshots: number; // 0,
  glpkclearzone: number; // 0,
  glpokechecks: number; // 0,
  glsavepct: number; // 0.82,
  glsaves: number; // 23,
  glshots: number; // 28,
  glsoperiods: number; // 0,
  isGuest: number; // 5,
  memberString: number; // 0,
  opponentClubId: number; // 641946,
  opponentScore: number; // 30,
  player_dnf: number; // 0,
  playerLevel: number; // 839,
  pNhlOnlineGameType: number; // 30,
  position: number; // 0,
  posSorted: number; // 15,
  rankpoints: number; // 0,
  ranktierassetid: number; // 0,
  ratingDefense: number; // 585,
  ratingOffense: number; // 540,
  ratingTeamplay: number; // 370,
  removedReason: number; // 36,
  result: number; // 36,
  score: number; // 24,
  scoreRaw: number; // 24,
  scoreString: number; // 0,
  skassists: number; // 5,
  skbs: number; // 13,
  skdeflections: number; // 0,
  skfol: number; // 25,
  skfopct: number; // 59.65,
  skfow: number; // 34,
  skgiveaways: number; // 118,
  skgoals: number; // 4,
  skgwg: number; // 0,
  skhits: number; // 50,
  skinterceptions: number; // 52,
  skpassattempts: number; // 239,
  skpasses: number; // 170,
  skpasspct: number; // 345.94,
  skpenaltiesdrawn: number; // 6,
  skpim: number; // 18,
  skpkclearzone: number; // 8,
  skplusmin: number; // 5,
  skpossession: number; // 2181,
  skppg: number; // 0,
  sksaucerpasses: number; // 2,
  skshg: number; // 0,
  skshotattempts: number; // 26,
  skshotonnetpct: number; // 170.83,
  skshotpct: number; // 100,
  skshots: number; // 10,
  sktakeaways: number; // 31,
  teamSide: number; // 6,
  toi: number; // 777,
  toiseconds: number; // 46617
};

export type Match = {
  matchId: string; // "4486637050044",
  timestamp: number; // 1648690566,
  timeAgo: {
    number: number; // 7,
    unit: string; // "days"
  };
  clubs: {
    [clubId: string]: Club;
  };
  players: {
    [clubId: string]: {
      [playerId: string]: Player;
    };
  };
  aggregate: {
    [clubId: string]: Aggregate;
  };
};

export type ClubWithAggregateAndPlayers = Club & { players: Record<string, ExtendedPlayer>, clubAgg: Aggregate; };

export type MatchWithClubsWithAggregateAndPlayers = Match & { clubs: Record<string, ClubWithAggregateAndPlayers> };

export type ClubWithPoints =
  Club
  & { points: number; wins: number; lossesCount: number; otLosses: number; assists: number; gamePlayCount: number; };

export type ClubWithAveragedPoints =
  Club
  & {
  averageGoals: number;
  averageGoalsAgainst: number;
  averagePuckPossession: number;
  averageTimeOnAttack: number;
};

export type PointsFromAllPlayers = {
  shotAttempts: number;
  shotsOnNet: number;
  puckPossession: number;
  shortHandedGoals: number;
  penaltyMinutes: number;
  hits: number;
  blockShots: number;
  giveaways: number;
  takeaways: number;
  interceptions: number;
};

export type ExtendedClub =
  Club
  & ClubWithAggregateAndPlayers
  & ClubWithPoints
  & ClubWithAveragedPoints
  & PointsFromAllPlayers
  & { __ID__: string; };

export type PlayerWithGameStats = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  shutOuts: number;
};

export type PlayerWithAveragePoints = {
  averagePuckPossession: number;
  averageFaceOffPercentage: number;
  averagePassPercentage: number;
  averageShotsOnNetPercentage: number;
  averageShootingPercentage: number;
  averageBreakawaySavePercentage: number;
  averageSavePercentageOnPenaltyKill: number;
  averageSavePercentage: number;
  averageGoalsAgainst: number;
};

export type ExtendedPlayer =
  Player
  & PlayerWithGameStats
  & PlayerWithAveragePoints
  & { __ID__: string; __CLUB_ID__: string; };
