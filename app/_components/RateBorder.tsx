import { getRateToRank } from '../_lib/services/getRateToRank';
import { getTop200 } from '../_lib/services/getTop200';
import { getTotalPlayers } from '../_lib/services/getTotalPlayers/[season]';
import RateBorderClient from './RateBorderClient';

export default async function RateBorder({ season }: { season: string }) {
  const rateToRankArr = await getRateToRank({ season });
  const total = (await getTotalPlayers({ season })).totalPlayers;
  const top200 = await getTop200({ season });
  return (
    <RateBorderClient
      rateToRanks={rateToRankArr}
      total={total}
      top200={top200}
    />
  );
}
