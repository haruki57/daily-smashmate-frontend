import { handleFailed, handleSucceed, path } from "..";

type Props = {
  currentRate: number;
  season: string;
};

export async function getRank({
  currentRate,
  season,
}: Props): Promise<{ rank: number; } | null> {
  return fetch(path(`/api/rank/${season}/${currentRate}`), {
    next: { revalidate: 3600 }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
