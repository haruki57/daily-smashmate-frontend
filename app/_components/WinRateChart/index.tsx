import { getRateCumulativeCounts } from '@/app/_lib/services/getRateCumulativeCounts';
import WinRateChartWrapper from './winrate-chart-wrapper';
import { getWinLoss } from '@/app/_lib/services/getWinLoss';
import { getPlayerRates } from '@/app/_lib/services/getPlayerRates';
import { getSeasonsDesc } from '@/app/lib/data';
import { getSeasons } from '@/app/_lib/services/getSeasons';

type Props = {
  playerId: number;
  season: string;
};

export default async function WinRateChart({ playerId, season }: Props) {
  const winLoss = await getWinLoss({ playerId, season });
  const seasons = await getSeasons();
  const isLatestSeason = season === seasons.at(-1)?.season;
  const currentPlayerRates = isLatestSeason
    ? await getPlayerRates({ season: seasons.at(-2)!.season })
    : await getPlayerRates({ season });
  return (
    <WinRateChartWrapper
      playerId={playerId}
      winLoss={winLoss}
      playerRates={currentPlayerRates}
    />
  );
}
