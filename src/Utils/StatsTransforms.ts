import {
  Club,
  ExtendedClub,
  ExtendedPlayer,
  Match,
  MatchWithClubsWithAggregateAndPlayers,
  PointsFromAllPlayers,
} from '../Types/Match';

export const cleanNaN = (value: number): number => isNaN(value) ? 0 : value;

export const secondsToHoursMinutesSeconds = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.round(value % 60);

  return hours ? `${hours}h ${minutes}m ${seconds}s` : minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

export const getClubWithPointsFromAllPlayers = (club: ExtendedClub): ExtendedClub => {
  const { __ID__: __CLUB_ID__, players = {}, otLosses } = club;
  const pointsFromAllPlayers: PointsFromAllPlayers = Object.values(players).reduce((acc, pl) => {
    const {
      shotAttempts: accShotAttempts = 0,
      shotsOnNet: accShotsOnNet = 0,
      puckPossession: accPuckPossession = 0,
      shortHandedGoals: accSHG = 0,
      penaltyMinutes: accPenaltyMinutes = 0,
      hits: accHits = 0,
      blockShots: accBlockShots = 0,
      giveaways: accGiveaways = 0,
      takeaways: accTakeaways = 0,
      interceptions: accInterceptions = 0,
    } = acc;
    const {
      skshotattempts = '0',
      skshotonnetpct = '0',
      skpossession = '0',
      skshg = '0',
      skpim = '0',
      skhits = '0',
      skbs = '0',
      skgiveaways = '0',
      sktakeaways = '0',
      skinterceptions = '0',
    } = pl;
    const cleanSKShotAttempts = parseInt(`${skshotattempts}`, 10);
    const cleanSKShotOnNetPct = parseFloat(`${skshotonnetpct}`);
    const cleanSKPossession = parseInt(`${skpossession}`, 10);
    const cleanSKSHG = parseInt(`${skshg}`, 10);
    const cleanSKPIM = parseInt(`${skpim}`, 10);
    const cleanSKHits = parseInt(`${skhits}`, 10);
    const cleanSKBlockedShots = parseInt(`${skbs}`, 10);
    const cleanSKGiveaways = parseInt(`${skgiveaways}`, 10);
    const cleanSKTakeaways = parseInt(`${sktakeaways}`, 10);
    const cleanSKInterceptions = parseInt(`${skinterceptions}`, 10);
    const shotAttempts = accShotAttempts + cleanSKShotAttempts;
    const shotsOnNet = accShotsOnNet + Math.ceil(cleanSKShotAttempts * (cleanSKShotOnNetPct / 100));
    const puckPossession = accPuckPossession + cleanSKPossession;
    const shortHandedGoals = accSHG + cleanSKSHG;
    const penaltyMinutes = accPenaltyMinutes + cleanSKPIM;
    const hits = accHits + cleanSKHits;
    const blockShots = accBlockShots + cleanSKBlockedShots;
    const giveaways = accGiveaways + cleanSKGiveaways;
    const takeaways = accTakeaways + cleanSKTakeaways;
    const interceptions = accInterceptions + cleanSKInterceptions;

    return {
      ...acc,
      shotAttempts,
      shotsOnNet,
      puckPossession,
      shortHandedGoals,
      penaltyMinutes,
      hits,
      blockShots,
      giveaways,
      takeaways,
      interceptions,
    };
  }, {} as PointsFromAllPlayers);
  const newPlayers = Object.keys(players).reduce((acc, k) => {
    const p = players[k];

    return {
      ...acc,
      [k]: {
        ...p,
        otLosses,
        __CLUB_ID__,
      },
    };
  }, {});

  return {
    ...club,
    ...pointsFromAllPlayers,
    players: newPlayers,
  };
};

export const clubWithPoints = (club: ExtendedClub): ExtendedClub => {
  const { players = {}, score = '0', opponentScore = '0', clubAgg = {} as any } = club;
  const { skassists = '0' } = clubAgg;
  const timeOnIce: number = Object.values(players).reduce((acc, p) => {
    const { toiseconds } = p;
    const cleanToi = parseInt(`${toiseconds}`, 10);

    return acc > cleanToi ? acc : cleanToi;
  }, 0);
  const cleanScore = parseInt(`${score}`, 10);
  const cleanOpponentScore = parseInt(`${opponentScore}`, 10);
  const inOvertime = timeOnIce > 3600;
  const hasWin = cleanScore > cleanOpponentScore;
  const otLoss = inOvertime && !hasWin;

  return {
    ...club,
    points: hasWin ? 2 : (otLoss ? 1 : 0),
    wins: hasWin ? 1 : 0,
    lossesCount: !hasWin ? 1 : 0,
    otLosses: otLoss ? 1 : 0,
    assists: parseInt(`${skassists}`, 10),
    gamePlayCount: 1,
  };
};

export const clubWithAveragedPoints = (club: ExtendedClub): ExtendedClub => {
  const { gamePlayCount = 0, goals = 0, goalsAgainst = 0, puckPossession = 0, toa = '0' } = club;
  const cleanGoals = parseInt(`${goals}`, 10);
  const cleanGoalsAgainst = parseInt(`${goalsAgainst}`, 10);
  const cleanTOA = parseInt(`${toa}`, 10);
  const averageGoals = cleanGoals / gamePlayCount;
  const averageGoalsAgainst = cleanGoalsAgainst / gamePlayCount;
  const averagePuckPossession = puckPossession / gamePlayCount;
  const averageTimeOnAttack = cleanTOA / gamePlayCount;

  return {
    ...club,
    averageGoals,
    averageGoalsAgainst,
    averagePuckPossession,
    averageTimeOnAttack,
  };
};

export const teamSide = (value: 1 | 0) => parseInt(`${value}`, 10) === 0 ? 'Home' : 'Away';

export const mergeClubAndAgg = (item: Match, useHomeAndAway: boolean = false): MatchWithClubsWithAggregateAndPlayers => {
  const {
    clubs = {} as any,
    aggregate = {} as any,
    players = {} as any,
  } = item;
  const clubAggs: any = {};

  Object.keys(clubs).forEach((clubId) => {
    const club = clubs[clubId];
    const agg = aggregate[clubId];
    const clubPlayers = players[clubId];
    const { teamSide }: Club = club;
    const teamSideName = parseInt(`${teamSide}`, 10) === 0 ? 'home' : 'away';

    clubAggs[useHomeAndAway ? teamSideName : clubId] = {
      ...club,
      clubAgg: agg,
      players: clubPlayers,
    };
  });

  return {
    ...item,
    clubs: clubAggs,
  };
};

export const limitDecimalPlaces = (value = 0): number => parseFloat(parseFloat(`${value}`).toFixed(2));

export const getPlayerWithGameStats = (player: ExtendedPlayer): ExtendedPlayer => {
  const { scoreString = '', glga = '0' } = player;
  const [score, opScore] = scoreString.split('-').map(s => parseInt(s, 10));
  const win = score > opScore;
  const losses = !win ? 1 : 0;
  const cleanGlga = parseInt(`${glga}`, 10);

  return {
    ...player,
    gamesPlayed: 1,
    wins: win ? 1 : 0,
    losses,
    shutOuts: cleanGlga === 0 ? 1 : 0,
  };
};

export const getPlayerWithAveragePoints = (player: ExtendedPlayer): ExtendedPlayer => {
  const {
    gamesPlayed = 0,
    skpossession = '0',
    skfopct = '0',
    skpasspct = '0',
    skshotonnetpct = '0',
    skshotpct = '0',
    glbrksavepct = '0',
    glpensavepct = '0',
    glsavepct = '0',
    glgaa = '0',
  } = player;
  const cleanPossession = parseInt(`${skpossession}`, 10);
  const cleanFopct = parseFloat(`${skfopct}`);
  const cleanPasspct = parseFloat(`${skpasspct}`);
  const cleanShotonnetpct = parseFloat(`${skshotonnetpct}`);
  const cleanShotpct = parseFloat(`${skshotpct}`);
  const cleanGlbrksavepct = parseFloat(`${glbrksavepct}`);
  const cleanGlpensavepct = parseFloat(`${glpensavepct}`);
  const cleanGlsavepct = parseFloat(`${glsavepct}`);
  const cleanGlgaa = parseFloat(`${glgaa}`);
  const averagePuckPossession = cleanPossession / gamesPlayed;
  const averageFaceOffPercentage = cleanFopct / gamesPlayed;
  const averagePassPercentage = cleanPasspct / gamesPlayed;
  const averageShotsOnNetPercentage = cleanShotonnetpct / gamesPlayed;
  const averageShootingPercentage = cleanShotpct / gamesPlayed;
  const averageBreakawaySavePercentage = cleanGlbrksavepct / gamesPlayed;
  const averageSavePercentageOnPenaltyKill = cleanGlpensavepct / gamesPlayed;
  const averageSavePercentage = cleanGlsavepct / gamesPlayed;
  const averageGoalsAgainst = cleanGlgaa / gamesPlayed;

  return {
    ...player,
    averagePuckPossession,
    averageFaceOffPercentage,
    averagePassPercentage,
    averageShotsOnNetPercentage,
    averageShootingPercentage,
    averageBreakawaySavePercentage,
    averageSavePercentageOnPenaltyKill,
    averageSavePercentage,
    averageGoalsAgainst,
  };
};
