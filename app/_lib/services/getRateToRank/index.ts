
import { handleFailed, handleSucceed, path } from "..";
import { RateToRank } from "../type";

export async function getRateToRank(
  { season, cache = true } : 
  { season: string; cache?: boolean; }
    
): Promise<RateToRank[]> {
  return fetch(path(`/api/rateToRank/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
