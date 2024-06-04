import { handleFailed, handleSucceed, path } from "..";
import { Top200 } from "../type";

export async function getTop200(): Promise<Top200[]> {
  return fetch(path(`/api/top200`), {
    next: { revalidate: 60 * 10 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
