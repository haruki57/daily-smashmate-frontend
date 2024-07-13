import { getRateToRank } from '../_lib/services/getRateToRank';
import { RateToRank, Top200 } from '../_lib/services/type';
import ChangeRate from '../ui/change-rate';
import { getTop200 } from '../_lib/services/getTop200';
import { getTotalPlayers } from '../_lib/services/getTotalPlayers/[season]';

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

export default async function RateBorder({
  season,
  rateStr,
}: {
  season: string;
  rateStr: string;
}) {
  const rateToRankArr = await getRateToRank({ season });
  const total = (await getTotalPlayers({ season })).totalPlayers;
  const top200 = await getTop200({ season });
  const max = rateToRankArr.at(0)?.rate;
  const min = rateToRankArr.at(-1)?.rate;
  let rate;
  if (rateStr === '' || rateStr == null) {
    rate = 2000;
  } else if (Number.isNaN(Number(rateStr))) {
    rate = 0;
  } else {
    rate = Number(rateStr);
  }
  const rank = rateToRank(top200, rateToRankArr, rate);

  return (
    <div className="mb-4 justify-center gap-4 md:flex">
      <div className="flex w-96 flex-col items-center rounded border p-8 md:w-64 md:p-12">
        <div className="h-12 text-2xl font-semibold">レート</div>
        <div>
          <ChangeRate value={rate} max={max ?? 3000} min={min ?? 1000} />
        </div>
      </div>
      <div className="mt-28 hidden md:block">{rightArrow}</div>
      <div className="my-2 flex justify-center md:hidden">{downArrow}</div>
      <div className="flex w-96 flex-col items-center rounded border p-8 md:w-64 md:p-12">
        <div className="h-12 text-2xl font-semibold">推定順位</div>
        <div className="mt-0.5 flex items-end justify-center text-6xl font-bold">
          <div className="my-2">{rank}</div>
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
