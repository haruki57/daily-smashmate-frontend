import { handleFailed, handleSucceed, path } from "..";
import type { RankByCharacter } from "../type";

type Props = {
  playerId: number;
  season: string;
  setRevalidate: boolean;
};

export async function getRanksByCharacters({
  playerId,
  season,
  setRevalidate=true,
}: Props): Promise<RankByCharacter[]> {
  return fetch(path(`/api/rankByCharacters/${playerId}/${season}`), {
    next: {
      revalidate: setRevalidate ?  60 * 10 : undefined,
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
