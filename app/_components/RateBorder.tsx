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
    <div className="flex justify-center gap-10">
      <div className="flex flex-col items-center">
        <div>レート</div>
        <ChangeRate value={rate} max={max ?? 3000} min={min ?? 1000} />
      </div>
      <div className="flex flex-col items-center">
        <div>順位</div>
        <div>{`${rank} / ${total} 人中`}</div>
      </div>
    </div>
  );
}
