'use client';

import { useState } from 'react';
import { RateToRank, Top200 } from '../_lib/services/type';

const rateToRank = (
  top200: Top200[],
  rateToRankArr: RateToRank[],
  rate: number,
): number => {
  const top200min = top200.at(-1)?.rate;
  if (top200min != null && top200min <= rate) {
    for (const top of top200) {
      if (top.rate <= rate) {
        return top.rank;
      }
    }
  }

  let ok = -1;
  let ng = rateToRankArr.length;
  while (Math.abs(ok - ng) > 1) {
    let mid = Math.trunc((ok + ng) / 2);
    if (rateToRankArr[mid].rate >= rate) {
      ok = mid;
    } else {
      ng = mid;
    }
  }
  return rateToRankArr.at(ok)?.rank ?? -1;
};

export default function RateBorderClient({
  rateToRanks,
  total,
  top200,
}: {
  rateToRanks: RateToRank[];
  total: number;
  top200: Top200[];
}) {
  const [rate, setRate] = useState(2000);

  const handleChange = (rate: number) => {
    setRate(rate);
  };
  const max = rateToRanks.at(0)?.rate;
  const min = rateToRanks.at(-1)?.rate;
  const rank = rateToRank(top200, rateToRanks, rate);

  return (
    <div className="mb-4 justify-center gap-4 md:flex">
      <div className="flex w-96 flex-col items-center rounded border p-8 md:w-80 md:p-12">
        <div className="h-12 text-2xl font-semibold">レート</div>
        <div>
          <input
            type="number"
            onChange={(e) => handleChange(Number(e.target.value))}
            value={rate}
            max={max}
            min={min}
            className="rounded text-center text-6xl font-bold tabular-nums"
          ></input>
        </div>
      </div>
      <div className="mt-28 hidden md:block">{rightArrow}</div>
      <div className="my-2 flex justify-center md:hidden">{downArrow}</div>
      <div className="flex w-96 flex-col items-center rounded border p-8 md:w-80 md:p-12">
        <div className="h-12 text-2xl font-semibold">推定順位</div>
        <div className="mt-0.5 flex items-end justify-center text-6xl font-bold">
          <div className="my-2 tabular-nums">{rank}</div>
          <div className="mb-1 ml-2 text-sm">{` 位`}</div>
        </div>
        <div className="mt-1 flex justify-center text-sm text-slate-500">
          {`${total} 人中`}
        </div>
      </div>
    </div>
  );
}

// https://www.svgrepo.com/svg/533605/arrow-narrow-right
const rightArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M4 12H20M20 12L16 8M20 12L16 16"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const downArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 4V20M12 20L8 16M12 20L16 16"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
