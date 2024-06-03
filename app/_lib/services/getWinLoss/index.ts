import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

type Props = {
  playerId: number;
  season: string;
};

export async function getWinLoss({
  playerId,
  season,
}: Props): Promise<{ matchRoomId: number; winnerId: number; loserId: number;  season: string}[]> {
  return fetch(path(`/api/winLoss/${playerId}/${season}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
