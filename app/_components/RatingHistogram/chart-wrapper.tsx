'use client';

import { PrismaClient } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
const prisma = new PrismaClient();

// Note: https://blog.mmmcorp.co.jp/2023/08/29/react-recharts/

type Props = {
  data: { rate: number; cumulativeCount: number }[];
  currentRate?: number;
};

export default function ChartWrapper({
  data: originalData,
  currentRate,
}: Props) {
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
      return {
        name: obj[0],
        count: obj[1],
        fill: '#82ca9d',
      };
    });
  }, [originalData, range]);
  const ticks = [];
  if (data && data.length > 0) {
    for (
      let i = Number(data.at(0)?.name);
      i <= Number(data.at(-1)?.name);
      i += 100
    ) {
      ticks.push(i);
    }
  }
  return (
    <div>
      <BarChart
        width={350}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 50,
        }}
        barCategoryGap={0}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          dx={4}
          dy={16}
          angle={90}
          fontSize={10}
          type="number"
          domain={['dataMin', 'dataMax']}
          ticks={ticks}
        />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          labelFormatter={(label) => {
            const labelNum = Number(label);
            return label + '~' + (labelNum + range - 1);
          }}
        />
        <YAxis unit={'人'} />
        <Bar dataKey="count" fill="#82ca9d" />
        {currentRate != null && (
          <ReferenceLine
            x={currentRate}
            stroke="#8884d8"
            label={currentRate}
            isFront={true}
            strokeWidth={2}
          />
        )}
      </BarChart>
    </div>
  );
}
