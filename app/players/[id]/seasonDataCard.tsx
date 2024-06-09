'use client';

import { useRouter } from 'next/navigation';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import Image from 'next/image';
import clsx from 'clsx';

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
        'max-w-xs  rounded-lg border-2 p-4 shadow-xl',
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
          {playerDataBySeason.currentCharactersCsv
            ?.split(',')
            .map((characterId) => {
              return (
                <Image
                  key={characterId}
                  src={`/characters/${characterId}.png`}
                  height={24}
                  width={24}
                  alt={characterId}
                />
              );
            })}
        </div>
        <div className="mt-2 flex flex-wrap items-center text-lg">
          <div className="flex-auto ">
            {`レート ${playerDataBySeason.currentRate}`}
          </div>
          <div className="flex-auto ">{`推定順位 ${99123} 位`}</div>
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
