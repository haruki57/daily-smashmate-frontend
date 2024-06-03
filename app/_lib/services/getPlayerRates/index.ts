import { handleFailed, handleSucceed, path } from "..";
import { PlayerRate } from "../type";

type Props = {
  season: string;
};

export async function getPlayerRates({
  season,
}: Props): Promise<PlayerRate[]> {
  return fetch(path(`/api/playerRates/${season}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
