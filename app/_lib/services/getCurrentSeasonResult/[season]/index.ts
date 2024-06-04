import { handleFailed, handleSucceed, path } from "../..";
import { SeasonResult } from "../../type";

type Props = {
  season: string;
};

export async function getSeasonResult({
  season,
}: Props): Promise<SeasonResult | null> {
  return fetch(path(`/api/seasonResult/${season}`), {
    next: { revalidate: 3600 * 12 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
