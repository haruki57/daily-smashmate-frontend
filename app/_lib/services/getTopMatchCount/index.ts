import { handleFailed, handleSucceed, path } from "..";
import { MatchCount } from "../type";

export async function getTopMatchCount(
  { season, setRevalidate=true }:
    { season: string; setRevalidate: boolean; }): Promise<MatchCount[]> {
  return fetch(path(`/api/topMatchCount/${season}`), {
    next: { revalidate: setRevalidate ? 60 * 10 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
