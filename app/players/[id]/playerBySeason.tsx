import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Select } from '@headlessui/react';
import { PrismaClient } from '@prisma/client/edge';
import { getPlayerIdsToRateMap } from '@/app/lib/data';
import RatingHistogram from '@/app/_components/RatingHistogram';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { getResults } from '@/app/_lib/services/getResults';
import { getPlayerRates } from '@/app/_lib/services/getPlayerRates';
import WinRateChart from '@/app/_components/WinRateChart';
import { getRank } from '@/app/_lib/services/getRank';
import { getTop200 } from '@/app/_lib/services/getTop200';
import { getTotalPlayers } from '@/app/_lib/services/getTotalPlayers/[season]';
const prisma = new PrismaClient();

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

  const top200 = await getTop200();
  const foundTop200 = top200.find((t) => t.playerId === playerId);
  if (foundTop200) {
    rank = foundTop200.rank;
    isRankEstimated = false;
  } else if (currentRate != null) {
    const rankRet = await getRank({ currentRate, season });
    rank = rankRet?.rank;
    isRankEstimated = true;
  }
  const totalPlayers = (await getTotalPlayers({ season })).totalPlayers;
  return (
    <>
      <div>{JSON.stringify({ ...playerDataBySeason })}</div>
      <div>{JSON.stringify({ rank, totalPlayers, isRankEstimated })}</div>
      <WinRateChart playerId={playerId} season={season} />
    </>
  );
}
