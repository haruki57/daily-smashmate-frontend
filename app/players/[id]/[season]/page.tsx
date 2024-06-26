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

export const runtime = 'edge';

export default async function Page({
  params,
}: {
  params: { id: string; season: string };
}) {
  const playerId = Number(params.id);
  const account = await getSmashmateAccount({
    playerId,
    revalidate: 60,
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
  const isSeasonFinished = currentSeasonRow?.ended_at == null ? true : false;

  const playerDataBySeason = playerDataBySeasons[season];
  if (!playerDataBySeason) {
    return (
      // TODO
      <div>{`${account.playerName} さんのシーズン ${season}のデータがありません。`}</div>
    );
  }
  const ranksByCharacters = await getRanksByCharacters({
    playerId,
    season,
  });
  const totalPlayerCount = await getTotalPlayers({ season });
  return (
    <>
      <PlayerPageHeader account={account} season={season} />
      <div className="my-2 grid grid-cols-2 gap-4">
        <CardInPlayerPage
          title="レート"
          mainContent={playerDataBySeason.currentRate || '----'}
          annotation={
            !isSeasonFinished && playerDataBySeason.maxRate != null
              ? `最高レート ${playerDataBySeason.maxRate}`
              : undefined
          }
        />
        <CardInPlayerPage
          title="全体順位"
          mainContent={
            playerDataBySeason.rankFromTop200 ?? playerDataBySeason.rank
          }
          unit="位"
          annotation={`${totalPlayerCount.totalPlayers}人中`}
        />
      </div>
      <div className="my-2 grid grid-cols-2 gap-4">
        {ranksByCharacters.map((rankForCharacter) => {
          return (
            <CardInPlayerPage
              key={rankForCharacter.characterId}
              title={
                <h4 className="flex">
                  <Image
                    src={`/characters/${rankForCharacter.characterId}.png`}
                    alt={rankForCharacter.characterId}
                    height={28}
                    width={28}
                  />
                  ファイター順位
                </h4>
              }
              mainContent={rankForCharacter.rank}
              unit="位"
              annotation={`${rankForCharacter.totalPlayerCount} 人中`}
            />
          );
        })}
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
