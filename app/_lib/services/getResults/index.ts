import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

type Props = {
  playerId: number;
  season: string;
  seasonForOpponentRates: string;
};

export async function getResults({
  playerId,
  season,
  seasonForOpponentRates,
}: Props): Promise<{ matchRoomId: number; winnerId: number; loserId: number; opponentId: number;  opponentRate: number | null}[]> {
  return fetch(path(`/api/results/${playerId}/${season}?prevSeason=${seasonForOpponentRates}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
