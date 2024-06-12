import ChangeSeason from '@/app/ui/change-season';
import PlayerBySeason from './playerBySeason';
import { getSmashmateAccount } from '@/app/_lib/services/getAccount';
import { getPlayerSeasonData as getPlayerDataBySeason } from '@/app/_lib/services/getPlayerSeasonData';
import { Suspense } from 'react';
import { getSeasons } from '@/app/_lib/services/getSeasons';
import SeasonDataCard from './seasonDataCard';
import VisitPlayer from '@/app/_components/VisitPlayer';
import CardInPlayerPage from '@/app/_components/CardInPlayerPage';
import { getRanksForCharacters } from '@/app/_lib/services/getRanksForCharacters';
import Image from 'next/image';
import { Account } from '@/app/_lib/services/type';

export const runtime = 'edge';

const PlayerPageHeader = ({
  account,
  season,
}: {
  account: Account;
  season?: string;
}) => {
  return (
    // The value of "top-10" depends on the height of RootHeader
    <div className="sticky top-10 z-50 bg-white">
      <div className="mx-2 flex items-end justify-between pt-2">
        <VisitPlayer
          playerName={account.playerName}
          playerId={account.playerId}
        />
        <h1 className="text-4xl font-semibold">{`${account.playerName}`}</h1>
        {season != null && <div>{`シーズン ${season}`}</div>}
      </div>
      <hr className="my-4 border-2 border-slate-300" />
    </div>
  );
};

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
    if (!playerDataBySeason) {
      return (
        // TODO
        <div>{`${account.playerName} さんのシーズン ${season}のデータがありません。`}</div>
      );
    }
    const ranksForCharacters = await getRanksForCharacters({
      playerId,
      season,
    });
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
            annotation="TODO人中"
          />
        </div>
        <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ranksForCharacters.map((rankForCharacter) => {
            return (
              <CardInPlayerPage
                key={rankForCharacter.characterId}
                title={
                  <div className="flex">
                    <Image
                      src={`/characters/${rankForCharacter.characterId}.png`}
                      alt={rankForCharacter.characterId}
                      height={24}
                      width={24}
                    />
                    ファイター順位
                  </div>
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

  return (
    <>
      <PlayerPageHeader account={account} season={season} />
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
