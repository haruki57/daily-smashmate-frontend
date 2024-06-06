import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

type Props = {
  playerId: number;
  season: string;
};

export async function getResults({
  playerId,
  season,
}: Props): Promise<{ matchRoomId: number; winnerId: number; loserId: number;  season: string}[]> {
  return fetch(path(`/api/results/${playerId}/${season}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
