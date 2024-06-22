import { handleFailed, handleSucceed, path } from "..";
import { MatchCount } from "../type";

export async function getTopMatchCount({season}: {season: string}): Promise<MatchCount[]> {
  return fetch(path(`/api/topMatchCount/${season}`), {
    next: { revalidate: 60 * 10 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
