import ChangeSeason from '@/app/ui/change-season';
import { PrismaClient } from '@prisma/client/edge';
import PlayerBySeason from './playerBySeason';
import { getHeatmap, getSeasonsDesc } from '@/app/lib/data';
import Heatmap from './heatmap';
import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
const prisma = new PrismaClient();

export const runtime = 'edge';

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
  const account = await getSmashmateAccount({
    playerId,
    revalidate: 3600 * 24,
  });

  // TODO
  if (!account) {
    return <div>Player not found</div>;
  }

  const playerDataBySeason = await getPlayerDataBySeason({ playerId });

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
      {seasons.map((season) => {
        if (playerDataBySeason[season]) {
          return (
            <div key={season}>{JSON.stringify(playerDataBySeason[season])}</div>
          );
        } else {
          return <div key={season}>{`Not found for シーズン:${season}`}</div>;
        }
      })}
      <ChangeSeason seasons={seasons} initialValue={season} />
      <PlayerBySeason
        playerId={playerId}
        season={season}
        isSeasonFinished={!!isSeasonFinished}
      />
    </>
  );
}
