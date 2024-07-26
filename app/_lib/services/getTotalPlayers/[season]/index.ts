import { handleFailed, handleSucceed, path } from "../..";

type Props = {
  season: string;
  cache?: boolean;
};

export async function getTotalPlayers({
  season,
  cache=true,
}: Props): Promise<{ totalPlayers: number; }> {
  return fetch(path(`/api/totalPlayers/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
