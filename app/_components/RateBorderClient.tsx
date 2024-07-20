'use client';

import { useEffect, useState } from 'react';
import { RateToRank, Top200 } from '../_lib/services/type';
import { getOrdinal } from '../_lib/utils';

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
  const [rate, setRate] = useState<number | ''>(1800);
  const [isSetManually, setIsSetManually] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (isSetManually || rate === '' || rate >= 2000) {
        clearInterval(id);
        return;
      }
      setRate((prev) => {
        if (prev === '') {
          return prev;
        }
        return prev + 1;
      });
    }, 3);
    return () => {
      clearInterval(id);
    };
  }, [rate, isSetManually]);

  const handleChange = (rateStr: string) => {
    setIsSetManually(true);
    if (rateStr === '') {
      setRate(rateStr);
      return;
    }
    const rateNum = Number(rateStr);
    if (Number.isNaN(rateNum)) {
      return;
    }
    if (0 <= rateNum && rateNum <= 9999) {
      setRate(rateNum);
    }
  };
  const max = rateToRanks.at(0)?.rate;
  const min = rateToRanks.at(-1)?.rate;
  const rank = rateToRank(top200, rateToRanks, rate === '' ? 1000 : rate);

  return (
    <div className="mb-4 justify-center gap-4 md:flex">
      <div className="flex w-80 flex-col items-center rounded border p-8 md:w-80 md:p-12">
        <div className="h-12 text-2xl font-semibold">レート</div>
        <div className="flex flex-col items-center">
          <input
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            value={rate}
            className="w-48 rounded text-center text-6xl font-bold tabular-nums"
          />
          <div className="mt-4 flex w-72 gap-1">
            <button
              className="rounded-full border px-1"
              onClick={() => {
                setIsSetManually(true);
                setRate((prev) => {
                  if (prev === '') return prev;
                  return prev - 1;
                });
              }}
            >
              -
            </button>
            <input
              type="range"
              className="w-full"
              value={rate}
              min={min}
              max={max}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button
              className="rounded-full border px-1"
              onClick={() => {
                setRate((prev) => {
                  setIsSetManually(true);
                  if (prev === '') return prev;
                  return prev + 1;
                });
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="mt-28 hidden md:block">{rightArrow}</div>
      <div className="my-2 flex justify-center md:hidden">{downArrow}</div>
      <div className="flex w-80 flex-col items-center rounded border p-8 md:w-80 md:p-12">
        <div className="h-12 text-2xl font-semibold">推定順位</div>
        <div className="mt-0.5 flex items-end justify-center text-6xl font-bold tabular-nums">
          <div className="my-2">{rank}</div>
          <div className="mb-2 ml-2 text-base">{` ${getOrdinal(rank)}`}</div>
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
