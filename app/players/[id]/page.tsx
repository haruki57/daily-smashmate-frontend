import ChangeSeason from '@/app/ui/change-season';
import { PrismaClient } from '@prisma/client';
import PlayerBySeason from './playerBySeason';
import {
  getHeatmap,
  getSeasonsDesc,
  getSmashmateAccount,
} from '@/app/lib/data';
import Heatmap from './heatmap';
const prisma = new PrismaClient();

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    season?: string;
  };
}) {
  const playerId = Number(params.id);
  const account = await getSmashmateAccount(playerId);
  if (!account) {
    return <div>Player not found</div>;
  }

  const seasonRows = await getSeasonsDesc();
  const seasons = seasonRows.map((row) => row.season);
  const season = searchParams?.season ? searchParams?.season : seasons[0];
  const currentSeasonRow = seasonRows
    .filter((row) => row.season == season)
    .at(0);
  const isSeasonFinished = currentSeasonRow?.ended_at == null ? true : false;

  return (
    <>
      <div>{account.playerName}</div>
      <div>
        <a
          href={`https://smashmate.net/user/${account.playerId}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          スマメイト(本家)のページへ
        </a>
      </div>
      <ChangeSeason seasons={seasons} />
      <PlayerBySeason
        playerId={playerId}
        season={season}
        isSeasonFinished={!!isSeasonFinished}
      />
    </>
  );
}
