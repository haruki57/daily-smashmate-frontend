import { handleFailed, handleSucceed, path } from "..";
import type { RankForCharacter } from "../type";

type Props = {
  playerId: number;
  season: string;
  revalidate?: number;
};

export async function getRanksForCharacters({
  playerId,
  season,
  revalidate,
}: Props): Promise<RankForCharacter[]> {
  return new Promise((resolve) => resolve([
    { characterId: "steve", rank: 123456, season: "28", playerId: 2345, totalPlayerCount: 23456 },
    { characterId: "mario", rank: 12345, season: "28", playerId: 2345, totalPlayerCount: 23456 },
    { characterId: "mario", rank: 12345, season: "28", playerId: 2345, totalPlayerCount: 23456 },
    { characterId: "mario", rank: 12345, season: "28", playerId: 2345, totalPlayerCount: 23456  },
  ]));
  /*
  return fetch(path(`/api/ranksForCharacters/${playerId}/${season}`), {
    cache: "force-cache",
    next: {
      ...(revalidate !== undefined && { revalidate }),
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
    */
}
