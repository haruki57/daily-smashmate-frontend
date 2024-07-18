import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import SeasonDataRow from './seasonDataRow';
import { PlayerPageHeader } from './PlayerPageHeader';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const playerId = Number(params.id);
  if (playerId == null || Number.isNaN(playerId)) {
    return {
      title: 'Player Not Found',
    };
  }
  const account = await getSmashmateAccount({
    playerId,
  });
  if (!account) {
    return {
      title: 'Player Not Found',
    };
  }
  return {
    title: account.playerName,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const playerId = Number(params.id);
  if (playerId == null || Number.isNaN(playerId)) {
    notFound();
  }
  const account = await getSmashmateAccount({
    playerId,
  });

  // TODO
  if (!account) {
    notFound();
  }
  const playerDataBySeasons = await getPlayerDataBySeason({ playerId });
  const seasonRows = await getSeasons();
  const latestSeasonRow = seasonRows.at(-1);
  const isSeasonFinished = latestSeasonRow?.ended_at != null;
  return (
    <>
      <PlayerPageHeader account={account} withSmashmateLink={true} />
      <div className="mx-4 my-2 flex flex-col items-center gap-4">
        {seasonRows
          .slice()
          .reverse()
          .map((seasonRow) => {
            const { season } = seasonRow;
            if (playerDataBySeasons[season]) {
              return (
                <>
                  <SeasonDataRow
                    playerDataBySeason={playerDataBySeasons[season]!}
                    seasonData={seasonRow}
                    isSeasonFinished={isSeasonFinished}
                    key={season}
                  />
                  <hr className="w-full border-slate-300" />
                </>
              );
            } else {
              return;
            }
          })}
      </div>
    </>
  );
}
