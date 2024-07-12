
import { handleFailed, handleSucceed, path } from "..";
import { RateToRank } from "../type";

export async function getRateToRank({season}: {season: string}): Promise<RateToRank[]> {
  return fetch(path(`/api/rateToRank/${season}`), {
    next: { revalidate: 3600 * 12 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
