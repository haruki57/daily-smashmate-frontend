import { getRateCumulativeCounts } from '@/app/_lib/services/getRateCumulativeCounts';
import ChartWrapper from './chart-wrapper';

type Props = {
  season: string;
  currentRate?: number;
};

export default async function RatingHistogram({ season, currentRate }: Props) {
  const cumulativeCounts = await getRateCumulativeCounts({ season });
  return <ChartWrapper data={cumulativeCounts} currentRate={currentRate} />;
}
