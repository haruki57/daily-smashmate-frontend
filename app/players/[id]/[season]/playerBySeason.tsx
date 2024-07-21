import RatingHistogram from '@/app/_components/RatingHistogram';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import ResultCharts from '@/app/_components/ResultsCharts';
import { getRank } from '@/app/_lib/services/getRank';
import { getTop200 } from '@/app/_lib/services/getTop200';
import DataUpdateDescription from './dataUpdateDescription';

export default async function PlayerBySeason({
  playerDataBySeason,
  season,
  isSeasonFinished,
}: {
  playerDataBySeason: PlayerDataBySeason;
  season: string;
  isSeasonFinished: boolean;
}) {
  const { playerId, currentRate } = playerDataBySeason;
  let rank = undefined;
  let isRankEstimated = false;

  const top200 = await getTop200({ season, setRevalidate: !isSeasonFinished });
  const foundTop200 = top200.find((t) => t.playerId === playerId);
  if (foundTop200) {
    rank = foundTop200.rank;
    isRankEstimated = false;
  } else if (currentRate != null) {
    const rankRet = await getRank({
      currentRate,
      season,
      setRevalidate: !isSeasonFinished,
    });
    rank = rankRet?.rank;
    isRankEstimated = true;
  }

  return (
    <>
      <div className="my-8">
        <RatingHistogram
          season={season}
          currentRate={currentRate ?? undefined}
        />
      </div>
      <h3 className="text-2xl font-bold">詳細戦績</h3>
      {Number(season) <= 27 ? (
        <div className="my-8">
          シーズン27以前のデータでは詳細戦績は利用できません
        </div>
      ) : (
        <>
          {!isSeasonFinished && (
            <div className="mt-2 text-sm text-slate-500">
              継続中のシーズンでは、対戦相手のレートとキャラクターは前シーズンの最終時点での情報を使用しています。
            </div>
          )}
          {!isSeasonFinished && playerDataBySeason.lastPlayerPageVisitedAt && (
            <div className="text-right text-sm text-slate-500">
              <div className="flex items-center justify-start">
                詳細戦績最終更新日:
                {new Date(
                  playerDataBySeason.lastPlayerPageVisitedAt,
                ).toLocaleDateString('ja-JP')}
                <DataUpdateDescription />
              </div>
              <div></div>
            </div>
          )}

          <h4 className="mt-2 text-xl font-bold">レート別対戦戦績</h4>

          <div className="my-8">
            <ResultCharts playerId={playerId} season={season} />
          </div>
        </>
      )}
    </>
  );
}
