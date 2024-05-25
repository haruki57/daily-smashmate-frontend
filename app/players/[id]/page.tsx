import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    season?: string;
  };
}) {
  //const currentSeasonRow = await prisma.smashmateCurrentSeason.findFirst();
  //const season = currentSeasonRow?.season;
  if (searchParams?.season) {
  }
  const season = '27';
  console.log(season);
  const player = await prisma.smashmatePlayerDataBySeason.findFirst({
    where: {
      playerId: Number(params.id),
      season,
    },
  });
  if (!player) {
    return <div>player not found</div>;
  }
  console.log(player);

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
  const opponentRows = await prisma.smashmatePlayerDataBySeason.findMany({
    where: {
      playerId: { in: Array.from(opponentPlayerIdSet) },
      season,
      currentRate: { not: null },
    },
    select: {
      playerId: true,
      currentRate: true,
    },
  });
  const playerIdToRate = opponentRows.reduce(
    (prev, current) => prev.set(current.playerId, current.currentRate || 0),
    new Map<number, number>(),
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
    const opponentRate = playerIdToRate.get(opponentId);
    if (opponentRate == null) {
      // most likely the opponent deleted the account.
      return;
    }
    const roundedRate = opponentRate - (opponentRate % 100);
    map.set(roundedRate, (map.get(roundedRate) ?? 0) + 1);
  });

  const max = opponentRows
    .map((r) => r.currentRate ?? -1)
    .reduce((prev, current) => Math.max(prev, current));
  const min = opponentRows
    .map((r) => r.currentRate ?? 9999)
    .reduce((prev, current) => Math.min(prev, current));
  const rates = [];
  console.log(min, max);
  for (let i = min - (min % 100); i <= max - (max % 100); i += 100) {
    rates.push(i);
    console.log(i, winPerRate.get(i) ?? 0, lossPerRate.get(i) ?? 0);
  }

  /*
  opponentRows.forEach((row) => {
    if (!row.currentRate) {
      return;
    }
    const currentRate = row.currentRate - (row.currentRate % 100);
    winPerRate.set(currentRate, (winPerRate.get(currentRate) ?? 0) + 1);
  });
  */

  return (
    <>
      <div>{JSON.stringify({ ...player, id: player?.id.toString() })}</div>
      <div>{JSON.stringify(searchParams)}</div>
      <div></div>
      <div>
        {rates.map((rate) => {
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
