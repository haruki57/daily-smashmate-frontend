import { handleFailed, handleSucceed, path } from "../..";
import { SeasonResult } from "../../type";

type Props = {
  season: string;
};

export async function getTotalPlayers({
  season,
}: Props): Promise<{ totalPlayers: number; }> {
  return fetch(path(`/api/totalPlayers/${season}`), {
    next: { revalidate: 3600 * 12 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
