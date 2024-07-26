import { handleFailed, handleSucceed, path } from "..";
import { Top200 } from "../type";

export async function getTop200(
  { season, cache=true }: 
  { season: string; cache?: boolean; }
): Promise<Top200[]> {
  return fetch(path(`/api/top200/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
