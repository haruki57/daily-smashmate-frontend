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
  cache=true,
}: Props): Promise<Result[]> {
  return fetch(path(`/api/results/${playerId}/${season}?prevSeason=${seasonForOpponentRates}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
