import { handleFailed, handleSucceed, path } from "..";
import type { Result } from "../type";

type Props = {
  playerId: number;
  season: string;
  seasonForOpponentRates: string;
  cache?: boolean;
};

export async function getResults({
  playerId,
  season,
  seasonForOpponentRates,
}: Props): Promise<Result[]> {
  return fetch(path(`/api/results/${playerId}/${season}?prevSeason=${seasonForOpponentRates}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
