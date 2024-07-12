import { handleFailed, handleSucceed, path } from "..";
import type { RankByCharacter } from "../type";

type Props = {
  playerId: number;
  season: string;
  revalidate?: number;
};

export async function getRanksByCharacters({
  playerId,
  season,
  revalidate,
}: Props): Promise<RankByCharacter[]> {
  return fetch(path(`/api/rankByCharacters/${playerId}/${season}`), {
    next: {
      ...(revalidate !== undefined && { revalidate }),
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
