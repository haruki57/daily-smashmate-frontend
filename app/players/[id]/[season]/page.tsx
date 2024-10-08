import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import { Suspense } from 'react';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import CardInPlayerPage from '@/app/_components/CardInPlayerPage';
import { getRanksByCharacters } from '@/app/_lib/services/getRanksByCharacters';
import Image from 'next/image';
import { getTotalPlayers } from '@/app/_lib/services/getTotalPlayers/[season]';
import { PlayerPageHeader } from '../PlayerPageHeader';
import PlayerBySeason from './playerBySeason';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getOrdinal } from '@/app/_lib/utils';

export async function generateMetadata({
  params,
}: {
  params: { id: string; season: string };
}): Promise<Metadata> {
  const playerId = Number(params.id);
  const account = await getSmashmateAccount({
    playerId,
  });
  return {
    title: `${account.playerName} (シーズン ${params.season})`,
  };
}

export default async function Page({
  params,
}: {
  params: { id: string; season: string };
}) {
  const playerId = Number(params.id);
  const account = await getSmashmateAccount({
    playerId,
  });
  if (!account) {
    notFound();
  }

  const playerDataBySeasons = await getPlayerDataBySeason({ playerId });

  const seasonRows = await getSeasons();
  const season = params.season;
  const currentSeasonRow = seasonRows
    .filter((row) => row.season == season)
    .at(0);
  const playerDataBySeason = playerDataBySeasons[season];
  if (!playerDataBySeason) {
    return (
      // TODO
      <div className="mt-4 flex justify-center">{`${
        account.playerName || '_'
      } さんのシーズン ${season}のデータがありません。`}</div>
    );
  }
  const isSeasonFinished = currentSeasonRow?.ended_at == null ? false : true;
  const cache = isSeasonFinished;
  const ranksByCharacters = await getRanksByCharacters({
    playerId,
    season,
    cache,
  });
  const totalPlayerCount = await getTotalPlayers({
    season,
    cache,
  });
  return (
    <>
      <PlayerPageHeader
        account={account}
        season={season}
        linkToTopPlayerPage={true}
      />
      <div className="mx-4">
        <div className="my-2 grid grid-cols-2 gap-4">
          <CardInPlayerPage
            title="レート"
            mainContent={playerDataBySeason.currentRate || '----'}
            annotation={
              isSeasonFinished && playerDataBySeason.maxRate != null
                ? `最高レート ${playerDataBySeason.maxRate}`
                : undefined
            }
          />
          <CardInPlayerPage
            title="全体順位"
            mainContent={
              playerDataBySeason.rankFromTop200 ??
              playerDataBySeason.rank ??
              '-'
            }
            unit={getOrdinal(
              playerDataBySeason.rankFromTop200 || playerDataBySeason.rank || 0,
            )}
            annotation={`${totalPlayerCount.totalPlayers} 人中`}
          />
        </div>
        <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ranksByCharacters.map((rankForCharacter) => {
            return (
              <CardInPlayerPage
                key={rankForCharacter.characterId}
                title={
                  <div className="flex">
                    <Image
                      src={`/fighters/${rankForCharacter.characterId}.png`}
                      alt={rankForCharacter.characterId}
                      height={28}
                      width={28}
                    />
                    ファイター順位
                  </div>
                }
                mainContent={rankForCharacter.rank}
                unit={getOrdinal(rankForCharacter.rank)}
                annotation={`${rankForCharacter.totalPlayerCount} 人中`}
              />
            );
          })}
        </div>

        {playerDataBySeason && (
          <Suspense
            fallback={
              <div
                className="mt-32 flex justify-center"
                aria-label="読み込み中"
              >
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            }
          >
            <PlayerBySeason
              playerDataBySeason={playerDataBySeason}
              season={season}
              isSeasonFinished={!!isSeasonFinished}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
