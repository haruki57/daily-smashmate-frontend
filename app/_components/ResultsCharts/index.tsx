import WinRateChartsClient from './results-chart-client';
import { getResults } from '@/app/_lib/services/getResults';
import { getPlayerRates } from '@/app/_lib/services/getPlayerRates';
import { getSeasons } from '@/app/_lib/services/getSeasons';

type Props = {
  playerId: number;
  season: string;
};

export default async function ResultCharts({ playerId, season }: Props) {
  const seasons = await getSeasons();
  const seasonRow = seasons.find((s) => s.season === season)!;
  const isLatestSeason = season === seasons.at(-1)?.season;
  const seasonForOpponentRates = isLatestSeason
    ? seasons.at(-2)!.season
    : season;
  const results = await getResults({
    playerId,
    season,
    seasonForOpponentRates,
  });
  return (
    <WinRateChartsClient
      playerId={playerId}
      results={results}
      seasonRow={seasonRow}
    />
  );
}
