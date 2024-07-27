import { getRateToRank } from '../_lib/services/getRateToRank';
import { getTop200 } from '../_lib/services/getTop200';
import { getTotalPlayers } from '../_lib/services/getTotalPlayers/[season]';
import { Season } from '../_lib/services/type';
import RateBorderClient from './RateBorderClient';

export default async function RateBorder({ season }: { season: Season }) {
  const isSeasonFinished = season.ended_at != null;
  const cache = isSeasonFinished;
  const rateToRankArr = await getRateToRank({
    season: season.season,
    cache,
  });
  const total = (await getTotalPlayers({ season: season.season, cache }))
    .totalPlayers;
  const top200 = await getTop200({ season: season.season, cache });
  return (
    <RateBorderClient
      rateToRanks={rateToRankArr}
      total={total}
      top200={top200}
    />
  );
}
