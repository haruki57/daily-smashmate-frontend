'use client';

import { useRouter } from 'next/navigation';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import Image from 'next/image';
import clsx from 'clsx';
import CharacterImages from '@/app/_components/Characters';

export default function SeasonDataCard({
  playerDataBySeason,
  season,
  isLatestSeason,
}: {
  playerDataBySeason: PlayerDataBySeason;
  season: string;
  isLatestSeason: boolean;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/players/${playerDataBySeason.playerId}?season=${season}`);
  };
  return (
    <div
      className={clsx([
        playerDataBySeason ? 'cursor-pointer' : 'bg-slate-100',
        'w-full max-w-sm rounded-lg border-2 p-4 shadow-xl',
      ])}
      onClick={handleClick}
    >
      <div className="flex flex-wrap items-center">
        <h1 className="flex-auto text-lg font-semibold text-slate-900">
          {`シーズン ${season}`}
        </h1>

        <div className="text-xs font-semibold text-slate-500">
          2024-06-09 ~ TODO TODO
        </div>
      </div>
      <div>
        <div className="mt-2 flex flex-wrap items-center">
          <CharacterImages
            charactersCsv={playerDataBySeason.currentCharactersCsv}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-lg">
          <div className="">{`レート ${playerDataBySeason.currentRate}`}</div>
          {playerDataBySeason.rankFromTop200 != null ? (
            <div className="">{`${playerDataBySeason.rankFromTop200} 位  / ${playerDataBySeason.totalPlayerCount} 人`}</div>
          ) : (
            <div className="">{`${playerDataBySeason.rank} 位 / ${playerDataBySeason.totalPlayerCount} 人`}</div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center text-lg">
          <div className="flex-auto ">
            {`${playerDataBySeason.win}勝 ${playerDataBySeason.loss}敗`}
          </div>
        </div>

        {isLatestSeason && (
          <p className="mt-2 text-sm text-slate-500">
            {`対戦成績更新日: ${
              playerDataBySeason.lastPlayerPageVisitedAt
                ? new Date(
                    playerDataBySeason.lastPlayerPageVisitedAt,
                  ).toLocaleString('ja-JP')
                : 'unknown'
            }`}
          </p>
        )}
      </div>
    </div>
  );
}
