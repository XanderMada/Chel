import axios from 'axios';
import Path from 'path';
import FS from 'fs';

const CLUB_ID_FILE_NAME = 'CLUB_IDS.txt';
const CLUB_ID_LIST = Object.keys(
  FS.readFileSync(CLUB_ID_FILE_NAME, 'utf8')
    .split('\n')
    .filter(cid => !!cid)
    .reduce((acc, cid) => ({
      ...acc,
      [cid]: true,
    }), {}),
);

const MATCH_DATA_DIR_NAME = 'MATCH_DATA';
const README_FILE_NAME = 'README.md';
const MATCH_LIST_FILE_NAME = 'MATCH_LIST.json';
const EXCLUDED_FILES_NAMES = [README_FILE_NAME, MATCH_LIST_FILE_NAME];

const run = async () => {
  let fullMatchList: any[] = [];

  for (const cId of CLUB_ID_LIST) {
    const { data } = await axios.get(`https://proclubs.ea.com/api/nhl/clubs/matches?matchType=club_private&platform=ps4&clubIds=${cId}`);
      
    fullMatchList = [...fullMatchList, ...data];
  }

  const matchDataDirExists = FS.existsSync(MATCH_DATA_DIR_NAME);

  if (!matchDataDirExists) {
    FS.mkdirSync(MATCH_DATA_DIR_NAME);
  }

  (fullMatchList as any[]).forEach((match) => {
    const { matchId, clubs = {} } = match;
    const clubIdList = Object.keys(clubs);
    const includeMatch = clubIdList.filter(clubId => CLUB_ID_LIST.includes(clubId)).length === clubIdList.length;

    if (includeMatch) {
      FS.writeFileSync(
        Path.join(MATCH_DATA_DIR_NAME, `${matchId}.json`),
        JSON.stringify(match, null, 2),
        { encoding: 'utf8' },
      );
    }
  });

  const matchFileList = FS.readdirSync(MATCH_DATA_DIR_NAME).filter(
    (fileName) => !EXCLUDED_FILES_NAMES.includes(fileName),
  ).map((fN) => JSON.parse(FS.readFileSync(Path.join(MATCH_DATA_DIR_NAME, fN), { encoding: 'utf8' })));

  FS.writeFileSync(
    Path.join(MATCH_DATA_DIR_NAME, MATCH_LIST_FILE_NAME),
    JSON.stringify(matchFileList, null, 2),
    { encoding: 'utf8' },
  );
};

run();
