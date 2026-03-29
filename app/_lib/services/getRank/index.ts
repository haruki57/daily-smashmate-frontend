import { handleFailed, handleSucceed, path } from "..";

type Props = {
  currentRate: number;
  season: string;
  cache?: boolean;
};

export async function getRank({
  currentRate,
  season,
}: Props): Promise<{ rank: number; } | null> {
  return fetch(path(`/api/rank/${season}/${currentRate}`))
    .then(handleSucceed)
    .catch(handleFailed);
}
