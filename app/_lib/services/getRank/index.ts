import { handleFailed, handleSucceed, path } from "..";

type Props = {
  currentRate: number;
  season: string;
  setRevalidate: boolean;
};

export async function getRank({
  currentRate,
  season,
  setRevalidate=true,
}: Props): Promise<{ rank: number; } | null> {
  return fetch(path(`/api/rank/${season}/${currentRate}`), {
    next: { revalidate: setRevalidate ? 3600 : undefined }
  })
    .then(handleSucceed)
    .catch(handleFailed);
}
