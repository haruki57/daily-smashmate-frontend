import { handleFailed, handleSucceed, path } from "..";

type Props = {
  season: string;
};

export async function getRateCumulativeCounts({
  season,
}: Props): Promise<{ rate: number; cumulativeCount: number}[]> {
  return fetch(path(`/api/rateCumulativeCounts/${season}`), {
    next: { revalidate: 3600 * 2 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
