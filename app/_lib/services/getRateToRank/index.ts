
import { handleFailed, handleSucceed, path } from "..";
import { RateToRank } from "../type";

export async function getRateToRank(
  { season, setRevalidate = true } : 
  { season: string; setRevalidate: boolean; }
): Promise<RateToRank[]> {
  return fetch(path(`/api/rateToRank/${season}`), {
    next: { revalidate: setRevalidate ? 60 * 10 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
