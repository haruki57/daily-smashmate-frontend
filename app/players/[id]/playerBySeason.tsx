import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Select } from '@headlessui/react';
import { PrismaClient } from '@prisma/client';
import { getPlayerIdsToRateMap } from '@/app/lib/data';
const prisma = new PrismaClient();

export default async function PlayerBySeason({
  playerId,
  season,
  isSeasonFinished,
}: {
  playerId: number;
  season: string;
  isSeasonFinished: boolean;
}) {
  const player = await prisma.smashmatePlayerDataBySeason.findFirst({
    where: {
      playerId,
      season,
    },
  });
  if (!player) {
    return <div>このシーズンでは情報なし。</div>;
  }

  const results = await prisma.smashmateMatchRoomResults.findMany({
    where: {
      season,
      OR: [{ winnerId: player.playerId }, { loserId: player.playerId }],
    },
  });
  const opponentPlayerIdSet = new Set<number>();
  results
    .map((r) => r.winnerId)
    .filter((id) => id != player.playerId)
    .forEach((id) => {
      if (id != null) {
        opponentPlayerIdSet.add(id);
      }
    });
  results
    .map((r) => r.loserId)
    .filter((id) => id != player.playerId)
    .forEach((id) => {
      if (id != null) {
        opponentPlayerIdSet.add(id);
      }
    });
  const playerIdToRateMap = await getPlayerIdsToRateMap(
    Array.from(opponentPlayerIdSet),
    season,
  );
  const winPerRate = new Map<number, number>();
  const lossPerRate = new Map<number, number>();
  results.forEach((result) => {
    if (result.winnerId == null || result.loserId == null) {
      // never happen
      return;
    }
    let opponentId: number;
    let map: Map<number, number>;
    if (result.winnerId == player.playerId) {
      opponentId = result.loserId;
      map = winPerRate;
    } else {
      opponentId = result.winnerId;
      map = lossPerRate;
    }
    const opponentRate = playerIdToRateMap.get(opponentId);
    if (opponentRate == null) {
      // most likely the opponent deleted the account.
      return;
    }
    const roundedRate = opponentRate - (opponentRate % 100);
    map.set(roundedRate, (map.get(roundedRate) ?? 0) + 1);
  });

  let max = -1;
  let min = 9999;
  playerIdToRateMap.forEach((rate) => {
    max = Math.max(max, rate);
    min = Math.min(min, rate);
  });
  const rateRanges = [];
  for (let i = min - (min % 100); i <= max - (max % 100); i += 100) {
    rateRanges.push(i);
  }

  return (
    <>
      <div>{JSON.stringify({ ...player, id: player?.id.toString() })}</div>
      <div></div>
      <div>
        {rateRanges.map((rate) => {
          return (
            <div key={rate} className="flex">
              <div>{`${rate} ~ ${rate + 99} `}</div>
              <div>{(winPerRate.get(rate) ?? 0) + '勝'}</div>
              <div>{(lossPerRate.get(rate) ?? 0) + '敗'}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
