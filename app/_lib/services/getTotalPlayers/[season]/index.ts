import { handleFailed, handleSucceed, path } from "../..";

type Props = {
  season: string;
  setRevalidate: boolean;
};

export async function getTotalPlayers({
  season,
  setRevalidate=true,
}: Props): Promise<{ totalPlayers: number; }> {
  return fetch(path(`/api/totalPlayers/${season}`), {
    next: { revalidate: setRevalidate ? 3600 * 12 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
