import { handleFailed, handleSucceed, path } from "..";
import type { PlayerDataBySeason } from "../type";

export async function getCurrentTime(): Promise<{ timestamp: number }> {
  return fetch(path(`/api/experimental/getTime`))
    .then(handleSucceed)
    .catch(handleFailed);
}
