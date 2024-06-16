import { handleFailed, handleSucceed, path } from "..";
import type { Result } from "../type";

type Props = {
  playerId: number;
  season: string;
  seasonForOpponentRates: string;
};

export async function getResults({
  playerId,
  season,
  seasonForOpponentRates,
}: Props): Promise<Result[]> {
  return fetch(path(`/api/results/${playerId}/${season}?prevSeason=${seasonForOpponentRates}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
