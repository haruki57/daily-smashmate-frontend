import { getRateCumulativeCounts } from '@/app/_lib/services/getRateCumulativeCounts';
import ChartWrapper from './chart-wrapper';

type Props = {
  season: string;
  isSeasonFinished: boolean;
  currentRate?: number;
};

export default async function RatingHistogram({
  season,
  isSeasonFinished,
  currentRate,
}: Props) {
  const cumulativeCounts = await getRateCumulativeCounts({
    season,
    cache: isSeasonFinished,
  });
  return <ChartWrapper data={cumulativeCounts} currentRate={currentRate} />;
}
