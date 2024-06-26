import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import SeasonDataCard from './seasonDataCard';
import { PlayerPageHeader } from './PlayerPageHeader';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function Page({ params }: { params: { id: string } }) {
  const playerId = Number(params.id);
  const account = await getSmashmateAccount({
    playerId,
    revalidate: 60,
  });

  // TODO
  if (!account) {
    notFound();
  }
  const playerDataBySeasons = await getPlayerDataBySeason({ playerId });

  const seasonRows = await getSeasons();
  const seasons = seasonRows.map((row) => row.season);

  const latestSeasonRow = seasonRows.at(-1);

  return (
    <>
      <PlayerPageHeader account={account} withSmashmateLink={true} />
      <div className="my-2 flex flex-col items-center gap-4">
        {seasons
          .slice()
          .reverse()
          .map((season) => {
            if (playerDataBySeasons[season]) {
              return (
                <SeasonDataCard
                  playerDataBySeason={playerDataBySeasons[season]!}
                  season={season}
                  isLatestSeason={latestSeasonRow?.season == season}
                  key={season}
                />
              );
            } else {
              return;
            }
          })}
      </div>
    </>
  );
}
