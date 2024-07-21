import { handleFailed, handleSucceed, path } from "..";
import { Top200 } from "../type";

export async function getTop200(
  { season, setRevalidate=true }:
    { season: string; setRevalidate: boolean; }
): Promise<Top200[]> {
  return fetch(path(`/api/top200/${season}`), {
    next: { revalidate: setRevalidate ? 60 * 10 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
