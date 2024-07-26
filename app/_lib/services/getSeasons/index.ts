import { handleFailed, handleSucceed, path } from "..";
import type { Season } from "../type";

export async function getSeasons(
  
): Promise<Season[]> {
  return fetch(path(`/api/seasons`), {
    next: {
      revalidate: 3600,
    },
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
