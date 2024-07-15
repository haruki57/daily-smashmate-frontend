'use client';

import { useRouter } from 'next/navigation';
import { PlayerDataBySeason, Season } from '@/app/_lib/services/type';
import Image from 'next/image';
import clsx from 'clsx';
import CharacterImages from '@/app/_components/Characters';
import { getOrdinal } from '@/app/_lib/utils';

const dateToJstDate = (dateStr: string | null) => {
  if (dateStr == null) {
    return '';
  }
  return new Date(dateStr).toLocaleDateString('ja-JP');
};

export default function SeasonDataRow({
  playerDataBySeason,
  seasonData,
  isLatestSeason,
}: {
  playerDataBySeason: PlayerDataBySeason;
  seasonData: Season;
  isLatestSeason: boolean;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/players/${playerDataBySeason.playerId}/${seasonData.season}`);
  };
  return (
    <div className="flex w-full text-sm md:text-base">
      <div className="flex basis-3/12 flex-col justify-center">
        <div className="text-sm font-bold md:text-lg">{`シーズン ${seasonData.season}`}</div>
        <div className="text-xs font-semibold text-slate-500">
          {dateToJstDate(seasonData.started_at)} -
          {dateToJstDate(seasonData.ended_at)}
        </div>
      </div>
      <div className="mx-2 flex basis-1/12 flex-col items-center justify-center">
        <CharacterImages
          charactersCsv={playerDataBySeason.currentCharactersCsv}
        />
      </div>
      <div className="flex basis-5/12 flex-col justify-center">
        <div>{`${playerDataBySeason.win ?? '-'}勝 ${
          playerDataBySeason.loss ?? '-'
        }敗`}</div>
        <div className="">{`レート ${
          playerDataBySeason.currentRate ?? '-'
        }`}</div>
        {playerDataBySeason.rankFromTop200 != null ? (
          <div>{`${playerDataBySeason.rankFromTop200} ${getOrdinal(
            playerDataBySeason.rankFromTop200,
          )}  / ${playerDataBySeason.totalPlayerCount} 人`}</div>
        ) : (
          <div>{`${playerDataBySeason.rank ?? '-'} ${getOrdinal(
            playerDataBySeason.rank || 0,
          )} / ${playerDataBySeason.totalPlayerCount} 人`}</div>
        )}
      </div>
      <div className="flex basis-3/12 flex-col items-end justify-center">
        <div
          className="w-fit cursor-pointer text-blue-500"
          onClick={handleClick}
        >
          詳細
        </div>
        {isLatestSeason && (
          <div className="mt-2 text-sm text-slate-500">
            <div>最終更新日:</div>
            <div>
              {`${
                playerDataBySeason.lastPlayerPageVisitedAt
                  ? new Date(
                      playerDataBySeason.lastPlayerPageVisitedAt,
                    ).toLocaleDateString('ja-JP')
                  : 'unknown'
              }`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
