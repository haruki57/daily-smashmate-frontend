import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

export async function getCurrentTime(param: string): Promise<{ timestamp: number }> {
  return fetch(path(`/api/experimental/getTime/${param}`), { next: {  revalidate: 20 }})
    .then(handleSucceed)
    .catch(handleFailed);
}
