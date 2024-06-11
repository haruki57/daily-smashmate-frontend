import ChangeSeason from '@/app/ui/change-season';
import PlayerBySeason from './playerBySeason';
import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import { Suspense } from 'react';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import SeasonDataCard from './seasonDataCard';
import VisitPlayer from '@/app/_components/VisitPlayer';
import CardInPlayerPage from '@/app/_components/CardInPlayerPage';

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

        <div className="my-2 flex flex-col justify-between gap-2 md:flex-row">
          <CardInPlayerPage />
          <CardInPlayerPage />
        </div>
        <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <CardInPlayerPage />

          <CardInPlayerPage />
          {/* <CardInPlayerPage /> */}
        </div>

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
      <VisitPlayer playerName={account.playerName} playerId={playerId} />
    </>
  );
}
