'use client';

import { PrismaClient } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
const prisma = new PrismaClient();

// Note: https://blog.mmmcorp.co.jp/2023/08/29/react-recharts/

type Props = {
  data: { rate: number; cumulativeCount: number }[];
};

export default function ChartWrapper({ data: originalData }: Props) {
  const [range, setRange] = useState<50 | 100>(50);

  const data = useMemo(() => {
    let min = 99999,
      max = -1;
    originalData.forEach(({ rate }) => {
      min = Math.min(min, rate);
      max = Math.max(max, rate);
    });
    const rateToNum: { [rate in number]: number } = {};
    for (let i = min - (min % range); i <= max; i += range) {
      rateToNum[i] = 0;
    }
    let prevCount = 0;
    originalData.forEach(({ rate, cumulativeCount }) => {
      const roundedRate = rate - (rate % range);
      rateToNum[roundedRate] += cumulativeCount - prevCount;
      prevCount = cumulativeCount;
    });
    return Object.entries(rateToNum).map((obj, index) => {
      return { name: index % 2 <= 1 ? obj[0] : undefined, count: obj[1] };
    });
  }, [originalData, range]);
  const ticks = [];
  for (let i = 1000; i < 3000; i += 200) {
    ticks.push(String(i));
  }
  return (
    <div>
      <div>chart</div>
      <BarChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          dx={4}
          dy={16}
          angle={90}
          fontSize={10}
          interval={range === 50 ? 1 : 0}
        />

        <Tooltip
          contentStyle={{ fontSize: 12 }}
          labelFormatter={(label) => {
            const labelNum = Number(label);
            return label + '~' + (labelNum + range);
          }}
        />
        <YAxis unit={'人'} />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
