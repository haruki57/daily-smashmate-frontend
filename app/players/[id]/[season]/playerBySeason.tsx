import RatingHistogram from '@/app/_components/RatingHistogram';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import WinRateChart from '@/app/_components/WinRateChart';
import { getRank } from '@/app/_lib/services/getRank';
import { getTop200 } from '@/app/_lib/services/getTop200';

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

  const top200 = await getTop200({ season });
  const foundTop200 = top200.find((t) => t.playerId === playerId);
  if (foundTop200) {
    rank = foundTop200.rank;
    isRankEstimated = false;
  } else if (currentRate != null) {
    const rankRet = await getRank({ currentRate, season });
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

      <h4 className="text-2xl font-bold">レート別対戦成績</h4>
      {playerDataBySeason.lastPlayerPageVisitedAt && (
        <div className="text-right text-sm text-slate-500">
          <div>対戦成績最終更新日</div>
          <div>
            {new Date(
              playerDataBySeason.lastPlayerPageVisitedAt,
            ).toLocaleDateString('ja-JP')}
          </div>
        </div>
      )}
      {!isSeasonFinished && (
        <div className="mt-2 text-sm text-slate-500">
          継続中のシーズン成績では、対戦相手のレートとキャラクターは前シーズンの最終時点での情報を使用しています。
        </div>
      )}
      <div className="my-8">
        <WinRateChart playerId={playerId} season={season} />
      </div>
    </>
  );
}
