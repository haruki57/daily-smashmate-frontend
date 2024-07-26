import { handleFailed, handleSucceed, path } from "..";

type Props = {
  season: string;
  cache?: boolean;
};

export async function getRateCumulativeCounts({
  season,
  cache=true,
}: Props): Promise<{ rate: number; cumulativeCount: number}[]> {
  return fetch(path(`/api/rateCumulativeCounts/${season}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
