import { handleFailed, handleSucceed, path } from "..";
import type { Result } from "../type";

type Props = {
  playerId: number;
  season: string;
  seasonForOpponentRates: string;
  setRevalidate: boolean;
};

export async function getResults({
  playerId,
  season,
  seasonForOpponentRates,
  setRevalidate=true,
}: Props): Promise<Result[]> {
  return fetch(path(`/api/results/${playerId}/${season}?prevSeason=${seasonForOpponentRates}`), {
    next: { revalidate: setRevalidate ? 3600 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
