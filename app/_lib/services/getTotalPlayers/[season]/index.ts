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
    next: { revalidate: setRevalidate ? 60 * 10 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
