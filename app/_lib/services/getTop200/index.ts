import { handleFailed, handleSucceed, path } from "..";
import { Top200 } from "../type";

export async function getTop200(
  { season }: 
  { season: string; cache?: boolean; }
): Promise<Top200[]> {
  return fetch(path(`/api/top200/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
