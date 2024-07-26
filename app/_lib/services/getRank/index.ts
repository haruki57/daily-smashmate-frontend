import { handleFailed, handleSucceed, path } from "..";

type Props = {
  currentRate: number;
  season: string;
  cache?: boolean;
};

export async function getRank({
  currentRate,
  season,
  cache=true,
}: Props): Promise<{ rank: number; } | null> {
  return fetch(path(`/api/rank/${season}/${currentRate}`), {
    cache: cache ? "force-cache" : "no-store",
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
