import { handleFailed, handleSucceed, path } from "..";
import { RateToRank } from "../type";

export async function getRateToRank(
  { season } : 
  { season: string; cache?: boolean; }
    
): Promise<RateToRank[]> {
  return fetch(path(`/api/rateToRank/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
