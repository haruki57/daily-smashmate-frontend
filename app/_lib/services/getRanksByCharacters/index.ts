import { handleFailed, handleSucceed, path } from "..";
import type { RankByCharacter } from "../type";

type Props = {
  playerId: number;
  season: string;
  cache?: boolean;
};

export async function getRanksByCharacters({
  playerId,
  season,
}: Props): Promise<RankByCharacter[]> {
  return fetch(path(`/api/rankByCharacters/${playerId}/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
