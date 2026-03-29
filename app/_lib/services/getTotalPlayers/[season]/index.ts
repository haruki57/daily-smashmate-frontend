import { handleFailed, handleSucceed, path } from "../..";

type Props = {
  season: string;
  cache?: boolean;
};

export async function getTotalPlayers({
  season,
}: Props): Promise<{ totalPlayers: number; }> {
  return fetch(path(`/api/totalPlayers/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
