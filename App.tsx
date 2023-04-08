import React, { FC, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Box, Tab, Tabs } from '@mui/material';
import { TabPanel } from './Components/TabPanel';
import { DataTable, DataTableColumn } from './Components/DataTable';
import { ExtendedClub, ExtendedPlayer, Match } from './Types/Match';
import { cleanBlank, combineTransforms, formatPercentage, timestampToDate } from './Utils/DataTransforms';
import {
  accumulate,
  combineArrays,
  findValueInEachItemByValuePath,
  findValueInItemByValuePath,
} from './Utils/ObjectSearch';
// @ts-ignore
import MatchListData from '../MATCH_DATA/MATCH_LIST';
import {
  cleanNaN,
  clubWithAveragedPoints,
  clubWithPoints,
  getClubWithPointsFromAllPlayers,
  getPlayerWithAveragePoints,
  getPlayerWithGameStats,
  limitDecimalPlaces,
  mergeClubAndAgg,
  secondsToHoursMinutesSeconds,
} from './Utils/StatsTransforms';

const MATCH_DATA: Match[] = MatchListData;
const MATCH_DATA_MERGED_CLUBS_AND_AGGS_HOME_AND_AWAY: Match[] = MATCH_DATA.map(m => mergeClubAndAgg(m, true));
const MATCH_DATA_MERGED_CLUBS_AND_AGGS: Match[] = MATCH_DATA.map(m => mergeClubAndAgg(m));
const CLUB_DATA: ExtendedClub[] = combineArrays(findValueInEachItemByValuePath(MATCH_DATA_MERGED_CLUBS_AND_AGGS, 'clubs/@ObjectAsArray<__ID__>'));
const CLUBS_WITH_POINTS: ExtendedClub[] = CLUB_DATA.map(clubWithPoints).map(getClubWithPointsFromAllPlayers);
const ACCUMULATED_CLUB_DATA: ExtendedClub[] = accumulate(CLUBS_WITH_POINTS, '__ID__', [
  '__ID__',
  'memberString',
  'opponentClubId',
  'opponentTeamArtAbbr',
  'scoreString',
  'teamArtAbbr',
  'details',
]).map(clubWithAveragedPoints);
const ALL_PLAYER_DATA: ExtendedPlayer[] = combineArrays(
  findValueInEachItemByValuePath(CLUBS_WITH_POINTS, 'players/@ObjectAsArray<__ID__>') as ExtendedPlayer[][],
).map(getPlayerWithGameStats);
const ACCUMULATED_PLAYER_DATA: ExtendedPlayer[] =
  (accumulate(findValueInItemByValuePath(ALL_PLAYER_DATA, '@WhereNot<position=goalie>'), '__ID__', ['__ID__', '__CLUB_ID__', 'playername', 'position', 'rankpoints', 'memberString', 'scoreString']) as ExtendedPlayer[]).map(getPlayerWithAveragePoints);
const ACCUMULATED_GOALIE_DATA: ExtendedPlayer[] =
  (accumulate(findValueInItemByValuePath(ALL_PLAYER_DATA, '@Where<position=goalie>'), '__ID__', ['__ID__', '__CLUB_ID__', 'playername', 'position', 'rankpoints', 'memberString', 'scoreString']) as ExtendedPlayer[]).map(getPlayerWithAveragePoints);

const cleanPowerPlayPercentage = combineTransforms(limitDecimalPlaces, cleanNaN);
const getClubName = (clubId: string) => {
  const club = CLUB_DATA.find(club => club.__ID__ === clubId);
  return club ? findValueInItemByValuePath(club, 'details/name') || '' : '';
};
// const formatPosition = (position = '') => position
//   .replace(/[A-Z]/gm, (m) => ` ${m}`)
//   .replace(/^[a-z]/gm, (m) => m.toUpperCase());

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #app-root {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;
const Base = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  width: 100vw;
  height: 100vh;
  overflow: auto;
`;
const TopBox = styled(Box)`
  position: sticky;
  top: 0;
  background-color: #ffffff;
`;
const TopTabs = styled(Tabs)`
  box-sizing: border-box;
  margin-bottom: -1px;

  & .MuiTabs-flexContainer {
    @media (max-width: 800px) {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const App: FC = () => {
  const [tabsValue, setTabsValue] = React.useState(0);
  const handleChange = useCallback(
    (_event: any, newValue: any) => {
      setTabsValue(newValue);
    },
    [setTabsValue],
  );

  return (
    <>
      <GlobalStyle />
      <Base>
        <TopBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TopTabs value={tabsValue} onChange={handleChange}>
            <Tab label='Game Stats' />
            <Tab label='Team Stats (Accumulated)' />
            <Tab label='Player Stats (Accumulated)' />
            <Tab label='Goalie Stats (Accumulated)' />
          </TopTabs>
        </TopBox>
        <TabPanel value={tabsValue} index={0}>
          <DataTable data={MATCH_DATA_MERGED_CLUBS_AND_AGGS_HOME_AND_AWAY}>
            <DataTableColumn name='Game' valuePath='timestamp' transform={timestampToDate} />
            <DataTableColumn name='Home TOA' valuePath='clubs/@TakeValueAtKeyName<home>/toa'
                             transform={secondsToHoursMinutesSeconds} />
            <DataTableColumn name='Home PPO' valuePath='clubs/@TakeValueAtKeyName<home>/ppo' />
            <DataTableColumn name='Home PPG' valuePath='clubs/@TakeValueAtKeyName<home>/ppg' />
            <DataTableColumn name='Home Shots' valuePath='clubs/@TakeValueAtKeyName<home>/clubAgg/skshots' />
            <DataTableColumn name='Home Team' valuePath='clubs/@TakeValueAtKeyName<home>/details/name' />
            <DataTableColumn name='Home Score' valuePath='clubs/@TakeValueAtKeyName<home>/score' />
            <DataTableColumn name='Away Score' valuePath='clubs/@TakeValueAtKeyName<away>/score' />
            <DataTableColumn name='Away Team' valuePath='clubs/@TakeValueAtKeyName<away>/details/name' />
            <DataTableColumn name='Away Shots' valuePath='clubs/@TakeValueAtKeyName<away>/clubAgg/skshots' />
            <DataTableColumn name='Away PPG' valuePath='clubs/@TakeValueAtKeyName<away>/ppg' />
            <DataTableColumn name='Away PPO' valuePath='clubs/@TakeValueAtKeyName<away>/ppo' />
            <DataTableColumn name='Away TOA' valuePath='clubs/@TakeValueAtKeyName<away>/toa'
                             transform={secondsToHoursMinutesSeconds} />
          </DataTable>
        </TabPanel>
        <TabPanel value={tabsValue} index={1}>
          <DataTable data={ACCUMULATED_CLUB_DATA}>
            <DataTableColumn name='Team' valuePath='details/name' transform={cleanBlank} />
            <DataTableColumn name='Games Played' valuePath='gamePlayCount' />
            <DataTableColumn name='Points' valuePath='points' />
            <DataTableColumn name='Wins' valuePath='wins' />
            <DataTableColumn name='Losses' valuePath='lossesCount' />
            <DataTableColumn name='OT Losses' valuePath='otLosses' />
            <DataTableColumn name='Goals' valuePath='goals' />
            <DataTableColumn name='Assists' valuePath='assists' />
            <DataTableColumn name='Goals Against' valuePath='goalsAgainst' />
            <DataTableColumn name='Goals For Average' valuePath='averageGoals' transform={limitDecimalPlaces} />
            <DataTableColumn name='Goals Against Average' valuePath='averageGoalsAgainst'
                             transform={limitDecimalPlaces} />
            <DataTableColumn name='Shot Attempts' valuePath='shotAttempts' />
            <DataTableColumn name='Shots On Net' valuePath='shotsOnNet' />
            <DataTableColumn name='Average Puck Possession' valuePath='averagePuckPossession'
                             transform={secondsToHoursMinutesSeconds} />
            <DataTableColumn name='Average Time On Attack' valuePath='averageTimeOnAttack'
                             transform={secondsToHoursMinutesSeconds} />
            <DataTableColumn name='Power Play Goals' valuePath='ppg' />
            <DataTableColumn
              name='Power Play %'
              valuePath={encodeURIComponent('@Math<ppg,/,ppo>')}
              transform={cleanPowerPlayPercentage}
            />
            <DataTableColumn name='Short Handed Goals' valuePath='shortHandedGoals' />
            <DataTableColumn name='Penalty Minutes' valuePath='penaltyMinutes' />
            <DataTableColumn name='Hits' valuePath='hits' />
            <DataTableColumn name='Block Shots' valuePath='blockShots' />
            <DataTableColumn name='Giveaways' valuePath='giveaways' />
            <DataTableColumn name='Takeaways' valuePath='takeaways' />
            <DataTableColumn name='Interceptions' valuePath='interceptions' />
          </DataTable>
        </TabPanel>
        <TabPanel value={tabsValue} index={2}>
          <DataTable data={ACCUMULATED_PLAYER_DATA}>
            <DataTableColumn name='Player Name' valuePath='playername' />
            <DataTableColumn name='Team Name' valuePath='__CLUB_ID__' transform={getClubName} />
            <DataTableColumn name='Games Played' valuePath='gamesPlayed' />
            <DataTableColumn name='Wins' valuePath='wins' />
            <DataTableColumn name='Losses' valuePath='losses' />
            <DataTableColumn name='OT Losses' valuePath='otLosses' />
            <DataTableColumn name='Goals' valuePath='skgoals' />
            <DataTableColumn name='Assists ' valuePath='skassists' />
            <DataTableColumn name='Plus / Minus' valuePath='skplusmin' />
            <DataTableColumn name='Penalty Minutes' valuePath='skpim' />
            <DataTableColumn name='Penalties Drawn' valuePath='skpenaltiesdrawn' />
            <DataTableColumn name='Hits' valuePath='skhits' />
            <DataTableColumn name='Block Shots' valuePath='skbs' />
            <DataTableColumn name='Giveaways' valuePath='skgiveaways' />
            <DataTableColumn name='Takeaways' valuePath='sktakeaways' />
            <DataTableColumn name='Interceptions' valuePath='skinterceptions' />
            <DataTableColumn name='Zone Clearings' valuePath='skpkclearzone' />
            <DataTableColumn name='Deflections' valuePath='skdeflections' />
            <DataTableColumn name='Faceoff Wins' valuePath='skfow' />
            <DataTableColumn name='Faceoff Losses' valuePath='skfol' />
            <DataTableColumn name='Average Faceoff %' valuePath='averageFaceOffPercentage'
                             transform={formatPercentage} />
            <DataTableColumn name='Average Puck Possession' valuePath='averagePuckPossession'
                             transform={secondsToHoursMinutesSeconds} />
            <DataTableColumn name='Average Pass %' valuePath='averagePassPercentage' transform={formatPercentage} />
            <DataTableColumn name='Passes Completed' valuePath='skpasses' />
            <DataTableColumn name='Saucer Passes' valuePath='sksaucerpasses' />
            <DataTableColumn name='Shot attempts' valuePath='skshotattempts' />
            <DataTableColumn name='Average Shot On Net %' valuePath='averageShotsOnNetPercentage'
                             transform={formatPercentage} />
            <DataTableColumn name='Average Shooting %' valuePath='averageShootingPercentage'
                             transform={formatPercentage} />
            <DataTableColumn name='Short Handed Goals' valuePath='skshg' />
            <DataTableColumn name='Power Play Goals' valuePath='skppg' />
            <DataTableColumn name='Game Winning Goals' valuePath='skgwg' />
            <DataTableColumn name='Time On Ice' valuePath='toiseconds' transform={secondsToHoursMinutesSeconds} />
          </DataTable>
        </TabPanel>
        <TabPanel value={tabsValue} index={3}>
          <DataTable data={ACCUMULATED_GOALIE_DATA}>
            <DataTableColumn name='Player Name' valuePath='playername' />
            <DataTableColumn name='Team Name' valuePath='__CLUB_ID__' transform={getClubName} />
            <DataTableColumn name='Games Played' valuePath='gamesPlayed' />
            <DataTableColumn name='Wins' valuePath='wins' />
            <DataTableColumn name='Losses' valuePath='losses' />
            <DataTableColumn name='OT Losses' valuePath='otLosses' />
            <DataTableColumn name='Average Save %' valuePath='averageSavePercentage' transform={formatPercentage} />
            <DataTableColumn name='Goals Against' valuePath='glga' />
            <DataTableColumn name='Saves' valuePath='glsaves' />
            <DataTableColumn name='Shots On Goal' valuePath='glshots' />
            <DataTableColumn name='Goals Against Average' valuePath='averageGoalsAgainst'
                             transform={limitDecimalPlaces} />
            <DataTableColumn name='Poke Check Saves' valuePath='glpokechecks' />
            <DataTableColumn name='Breakaway Saves' valuePath='glbrksaves' />
            <DataTableColumn name='Breakaway Shots' valuePath='glbrkshots' />
            <DataTableColumn name='Average Breakaway Save %' valuePath='averageBreakawaySavePercentage'
                             transform={formatPercentage} />
            <DataTableColumn name='Dangerous Saves' valuePath='gldsaves' />
            <DataTableColumn name='Penalty Kill Saves' valuePath='glpensaves' />
            <DataTableColumn name='Save % On Penalty Kill' valuePath='averageSavePercentageOnPenaltyKill'
                             transform={formatPercentage} />
            <DataTableColumn name='Zone Clearings' valuePath='glpkclearzone' />
            <DataTableColumn name='Shutouts' valuePath='shutOuts' />
          </DataTable>
        </TabPanel>
      </Base>
    </>
  );
};
