import { handleFailed, handleSucceed, path } from "..";
import { MatchCount } from "../type";

export async function getTopMatchCount(
  { season }:
  { season: string; cache?: boolean; }): Promise<MatchCount[]> {
  return fetch(path(`/api/topMatchCount/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
