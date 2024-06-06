import WinRateChartWrapper from './winrate-chart-wrapper';
import { getResults } from '@/app/_lib/services/getResults';
import { getPlayerRates } from '@/app/_lib/services/getPlayerRates';
import { getSeasons } from '@/app/_lib/services/getSeasons';

type Props = {
  playerId: number;
  season: string;
};

export default async function WinRateChart({ playerId, season }: Props) {
  const results = await getResults({ playerId, season });
  const seasons = await getSeasons();
  const isLatestSeason = season === seasons.at(-1)?.season;

  return (
    <WinRateChartWrapper
      playerId={playerId}
      results={results}
      seasonForOpponentRates={isLatestSeason ? seasons.at(-2)!.season : season}
    />
  );
}
