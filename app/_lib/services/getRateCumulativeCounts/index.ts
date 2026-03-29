import { handleFailed, handleSucceed, path } from "..";

type Props = {
  season: string;
  cache?: boolean;
};

export async function getRateCumulativeCounts({
  season,
}: Props): Promise<{ rate: number; cumulativeCount: number}[]> {
  return fetch(path(`/api/rateCumulativeCounts/${season}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
