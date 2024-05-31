import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

export async function getCurrentTime(): Promise<{ timestamp: number }> {
  return fetch(path(`/api/experimental/getTime`), { next: {  revalidate: 20 }})
    .then(handleSucceed)
    .catch(handleFailed);
}
