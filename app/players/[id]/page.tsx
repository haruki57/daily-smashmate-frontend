import ChangeSeason from '@/app/ui/change-season';
import { PrismaClient } from '@prisma/client/edge';
import PlayerBySeason from './playerBySeason';
import { getHeatmap, getSeasonsDesc } from '@/app/lib/data';
import Heatmap from './heatmap';
import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import RatingHistogram from '@/app/_components/RatingHistogram';
import { Suspense } from 'react';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import SeasonDataCard from './seasonDataCard';
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
    revalidate: 60,
  });

  // TODO
  if (!account) {
    return <div>Player not found</div>;
  }
  const playerDataBySeasons = await getPlayerDataBySeason({ playerId });

  const seasonRows = await getSeasons();
  const seasons = seasonRows.map((row) => row.season);
  const season = searchParams?.season;
  const currentSeasonRow = seasonRows
    .filter((row) => row.season == season)
    .at(0);
  const isSeasonFinished = currentSeasonRow?.ended_at == null ? true : false;

  if (season) {
    const playerDataBySeason = playerDataBySeasons[season];
    return (
      <>
        <ChangeSeason seasons={seasons} initialValue={season} />
        {playerDataBySeason && (
          <Suspense fallback={<div>Player Season取得中…</div>}>
            <PlayerBySeason
              playerDataBySeason={playerDataBySeason}
              season={season}
              isSeasonFinished={!!isSeasonFinished}
            />
          </Suspense>
        )}
      </>
    );
  }

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
      {seasons
        .slice()
        .reverse()
        .map((season) => {
          if (playerDataBySeasons[season]) {
            return (
              <div key={season}>
                <SeasonDataCard
                  playerDataBySeason={playerDataBySeasons[season]!}
                  season={season}
                  isLatestSeason={currentSeasonRow?.season == season}
                />
              </div>
            );
          } else {
            return;
          }
        })}
    </>
  );
}
