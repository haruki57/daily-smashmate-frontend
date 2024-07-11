export type Account = {
  playerName: string;
  playerId: number;
};

export type Season = {
  season: string;
  started_at: string;
  ended_at: string | null;
};
export type PlayerRate = {
  playerId: number;
  currentRate: number;
};

export type PlayerDataBySeason = {
  season: string;
  playerId: number;
  currentRate: number | null;
  maxRate: number | null;
  win: number | null;
  loss: number | null;
  currentCharactersCsv: string | null; 

  // on DB this is nonnull. But because some data are incorrect, 
  // I set "1000-04-01 14:00:00+00" for some rows.
  // For the rows, I set undefined on API layer
  lastPlayerPageVisitedAt: string | undefined;
  rank: number | null;
  rankFromTop200: number | null;

  totalPlayerCount: number | null;
}

export type RateCumulativeCounts = {
  season: string;
  rate: number;
  cumulativeCount: number;
  created_at: Date;
}

export type Top200 = {
  rank: number;
  rate: number;
  playerId: number;
  currentCharactersCsv: string;
  accountInfo?: Account;
}

export type SeasonResult = {
  season: string;
  totalPlayers: number;
  totalRooms: number;
}

export type PlayerRatesJson = {
  [key in string]: number;
}
export type PlayerDataElem = {
  id: number; name: string; alias: string; fighters?: string; mId?: number;
}
export type PlayerDataJson = PlayerDataElem[]

export type Photo = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  categoryId: string;
  likedCount: number;
};

export type Category = {
  id: string;
  createdAt: string;
  name: string;
  label: string;
  description: string;
  imageUrl: string;
  photos: Photo[];
};

export type Comment = {
  id: string;
  createdAt: string;
  authorId: string;
  photoId: string;
  comment: string;
};

export type RankByCharacter = {
  characterId: string;
  rank: number;
  totalPlayerCount: number;
}

export type Result = {
  matchRoomId: number;
  winnerId: number;
  loserId: number;
  opponentRate: number | null;
  currentCharactersCsv: string | null;
  playerName: string | null
  date: string | null
}

export type MatchCount = {
  playerId: number;
  season: string;
  matchCount: number;
  playerName: string;
  currentCharactersCsv: string | null;
}