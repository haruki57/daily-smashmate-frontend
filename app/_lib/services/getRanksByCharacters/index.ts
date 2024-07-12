import { handleFailed, handleSucceed, path } from "..";
import type { RankByCharacter } from "../type";

type Props = {
  playerId: number;
  season: string;
};

export async function getRanksByCharacters({
  playerId,
  season,
}: Props): Promise<RankByCharacter[]> {
  return fetch(path(`/api/rankByCharacters/${playerId}/${season}`), {
    next: {
      revalidate: 60 * 10,
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
