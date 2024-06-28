import { handleFailed, handleSucceed, path } from "..";
import { Top200 } from "../type";

export async function getTop200({season}: {season: string}): Promise<Top200[]> {
  return fetch(path(`/api/top200/${season}`), {
    next: { revalidate: 60 * 10 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
