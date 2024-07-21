import WinRateChartsClient from './results-chart-client';
import { getResults } from '@/app/_lib/services/getResults';
import { getSeasons } from '@/app/_lib/services/getSeasons';

type Props = {
  playerId: number;
  season: string;
};

export default async function ResultCharts({ playerId, season }: Props) {
  const seasons = await getSeasons();
  const seasonRow = seasons.find((s) => s.season === season)!;
  const isSeasonFinished = seasonRow.ended_at == null ? false : true;
  const seasonForOpponentRates = isSeasonFinished
    ? season
    : seasons.at(-2)!.season;
  const results = await getResults({
    playerId,
    season,
    seasonForOpponentRates,
    setRevalidate: !isSeasonFinished,
  });
  return (
    <WinRateChartsClient
      playerId={playerId}
      results={results}
      seasonRow={seasonRow}
    />
  );
}
