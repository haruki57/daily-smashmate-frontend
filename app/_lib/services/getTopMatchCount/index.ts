import { handleFailed, handleSucceed, path } from "..";
import { MatchCount } from "../type";

export async function getTopMatchCount(
  { season, cache=true, }:
  { season: string; cache?: boolean; }): Promise<MatchCount[]> {
  return fetch(path(`/api/topMatchCount/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
