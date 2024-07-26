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
  cache=true,
}: Props): Promise<RankByCharacter[]> {
  return fetch(path(`/api/rankByCharacters/${playerId}/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
