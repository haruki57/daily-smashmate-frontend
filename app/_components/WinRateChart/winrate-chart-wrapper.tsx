'use client';

import { PlayerRate } from '@/app/_lib/services/type';
import { usePlayerRates } from '@/app/lib/hooks/usePlayerRates';
import { PrismaClient } from '@prisma/client/edge';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
const prisma = new PrismaClient();

// Note: https://blog.mmmcorp.co.jp/2023/08/29/react-recharts/

type Props = {
  playerId: number;
  results: {
    matchRoomId: number;
    winnerId: number;
    loserId: number;
    season: string;
  }[];
  seasonForOpponentRates: string;
};

const sampleData = [
  {
    name: '1000',
    winRate: 3.5,
  },
  {
    name: '1100',
    winRate: 34.5,
  },
  {
    name: '1200',
    winRate: 74.5,
  },
  {
    name: '1300',
    winRate: 3.5,
  },
  {
    name: '1400',
    winRate: 34.5,
  },
  {
    name: '1500',
    winRate: 74.5,
  },
  {
    name: '1600',
    winRate: 3.5,
  },
  {
    name: '1700',
    winRate: 34.5,
  },
  {
    name: '1800',
    winRate: 74.5,
  },
  {
    name: '1900',
    winRate: 3.5,
  },
  {
    name: '2000',
    winRate: 34.5,
  },
  {
    name: '2100',
    winRate: 74.5,
  },
  {
    name: '2200',
    winRate: 74.5,
  },
  {
    name: '2300',
    winRate: 74.5,
  },
  {
    name: '2400',
    winRate: 74.5,
  },
  {
    name: '2500',
    winRate: 74.5,
  },
  {
    name: '2600',
    winRate: 74.5,
    lossRate: 100 - 74.5,
  },
];

export default function WinRateChartWrapper({
  playerId,
  results,
  seasonForOpponentRates,
}: Props) {
  const playerRates = usePlayerRates(seasonForOpponentRates);
  const [rateRangeToWInLoss, data] = useMemo(() => {
    if (!playerRates) {
      return [undefined, undefined];
    }
    const playerIdToRate = new Map<number, number>();
    Object.entries(playerRates).forEach(([playerIdStr, currentRate]) => {
      const playerId = Number(playerIdStr);
      playerIdToRate.set(playerId, currentRate);
    });

    let min = 99999,
      max = -1;
    results.forEach((w) => {
      const { winnerId, loserId } = w;
      if (playerId === winnerId) {
        min = Math.min(min, playerIdToRate.get(loserId) ?? 99999);
        max = Math.max(max, playerIdToRate.get(loserId) ?? -1);
      } else {
        min = Math.min(min, playerIdToRate.get(winnerId) ?? 99999);
        max = Math.max(max, playerIdToRate.get(winnerId) ?? -1);
      }
    });
    const rateRangeToWinLoss = new Map<number, number[]>();
    for (let i = min - (min % 100); i <= max; i += 100) {
      rateRangeToWinLoss.set(i, [0, 0]);
    }
    results.forEach((w) => {
      const { winnerId, loserId } = w;
      if (playerId === winnerId && playerIdToRate.get(loserId) !== undefined) {
        const rateRange =
          playerIdToRate.get(loserId)! - (playerIdToRate.get(loserId)! % 100);
        rateRangeToWinLoss.get(rateRange)![0]++;
      } else if (
        playerId === loserId &&
        playerIdToRate.get(winnerId) !== undefined
      ) {
        const rateRange =
          playerIdToRate.get(winnerId)! - (playerIdToRate.get(winnerId)! % 100);
        rateRangeToWinLoss.get(rateRange)![1]++;
      }
    });
    const ret: { name: string; winRate: number; lossRate: number }[] = [];
    rateRangeToWinLoss.forEach((value, key) => {
      if (value[0] + value[1] != 0)
        ret.push({
          name: String(key),
          winRate: (value[0] / (value[0] + value[1])) * 100,
          lossRate: (value[1] / (value[0] + value[1])) * 100,
        });
    });
    return [rateRangeToWinLoss, ret];
  }, [playerId, results, playerRates]);
  if (rateRangeToWInLoss == undefined || data == undefined) {
    return <div>読込中...</div>;
  }
  return (
    <div style={{ fontFamily: 'monospace' }}>
      <BarChart
        layout="vertical"
        width={350}
        height={data.length * 40}
        data={data}
        margin={{
          left: 30,
          right: 30,
        }}
        barSize={24}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          hide={true}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickFormatter={(value) => {
            const winLoss = rateRangeToWInLoss.get(Number(value));
            if (winLoss) {
              const [win, loss] = winLoss;
              return `${value}~ (${win}勝${loss}敗)`;
            } else {
              return `${value}~`;
            }
          }}
        />

        <Bar dataKey="winRate" fill="#82ca9d" stackId="a" />
        <Bar dataKey="lossRate" fill="#FF6969" stackId="a" />
        <ReferenceLine x={50} stroke="#AAAAAA" isFront={false} />
      </BarChart>
    </div>
  );
}
