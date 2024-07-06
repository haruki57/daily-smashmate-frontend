'use client';

import { Result, Season } from '@/app/_lib/services/type';
import {
  Checkbox,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import Image from 'next/image';
import { Fragment, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import CharacterImages from '../Characters';
import ActivityChart from './ActivityChart';
import { WinLossPlayersModal } from './WinLossPlayersModal';

// Note: https://blog.mmmcorp.co.jp/2023/08/29/react-recharts/

type Props = {
  playerId: number;
  results: Result[];
  seasonRow: Season;
};

export type Opponent = {
  playerId: number;
  playerName: string;
  count: number;
  fighters: string[];
};

export const NO_DATA_KEY = 'データ無し';
export type NO_DATA_KEY = 'データ無し';

export const resultsToOpponents = (results: Result[]) => {};

export default function WinRateChartsClient({
  playerId,
  results,
  seasonRow,
}: Props) {
  const [range, setRange] = useState<number>(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showingModalRateRange, setShowingModalRateRange] = useState<
    number | NO_DATA_KEY
  >(1500);

  const [
    rateRangeToWinnersAndLosers,
    rateRangeToWinLoss,
    data,
    dateStrToResults,
  ] = useMemo(() => {
    let min = 99999;
    let max = -1;
    results.forEach((w) => {
      const { opponentRate } = w;
      min = Math.min(min, opponentRate ?? 99999);
      max = Math.max(max, opponentRate ?? -1);
    });
    const hasNoData = results.reduce((prev, cur) => {
      return prev || cur.opponentRate == null;
    }, false);
    const rateRangeToWinLoss = new Map<number | NO_DATA_KEY, number[]>();
    if (hasNoData) {
      rateRangeToWinLoss.set(NO_DATA_KEY, [0, 0]);
    }
    for (let i = min - (min % range); i <= max; i += range) {
      rateRangeToWinLoss.set(i, [0, 0]);
    }

    results.forEach((w) => {
      const { winnerId, opponentRate } = w;
      let rateRange: number | NO_DATA_KEY | undefined = undefined;
      if (opponentRate != null) {
        rateRange = opponentRate - (opponentRate % range);
      } else {
        rateRange = NO_DATA_KEY;
      }
      if (winnerId === playerId) {
        rateRangeToWinLoss.get(rateRange)![0]++;
      } else {
        rateRangeToWinLoss.get(rateRange)![1]++;
      }
    });

    const rateRangeToWinnersAndLosers = new Map<
      number | NO_DATA_KEY,
      { winners: Opponent[]; losers: Opponent[] }
    >();
    results.forEach((result) => {
      const { winnerId, loserId, opponentRate } = result;
      let rateRange: number | NO_DATA_KEY | undefined = undefined;
      let opponentId: number | undefined = undefined;
      if (opponentRate != null) {
        rateRange = opponentRate - (opponentRate % range);
      } else {
        rateRange = NO_DATA_KEY;
      }
      if (playerId === winnerId) {
        opponentId = loserId;
      } else if (playerId === loserId) {
        opponentId = winnerId;
      }
      if (rateRange == undefined || opponentId == undefined) {
        return;
      }
      if (!rateRangeToWinnersAndLosers.get(rateRange)) {
        rateRangeToWinnersAndLosers.set(rateRange, {
          winners: [],
          losers: [],
        });
      }
      const { winners, losers } = rateRangeToWinnersAndLosers.get(rateRange)!;
      const list = opponentId === winnerId ? losers : winners;
      const foundOpponent = list.find((l) => l.playerId === opponentId);
      if (foundOpponent) {
        foundOpponent.count++;
      } else {
        list.push({
          playerId: opponentId,
          playerName: result.playerName || '【退会済】',
          count: 1,
          fighters: result.currentCharactersCsv?.split(',') || [],
        });
      }
    });

    Array.from(rateRangeToWinnersAndLosers.entries()).forEach(
      ([, winnerLosers]) => {
        winnerLosers.winners.sort((a, b) => b.count - a.count);
        winnerLosers.losers.sort((a, b) => b.count - a.count);
      },
    );

    const ret: { name: string; winRate: number; lossRate: number }[] = [];
    rateRangeToWinLoss.forEach((value, key) => {
      if (value[0] + value[1] != 0)
        ret.push({
          name: String(key),
          winRate: (value[0] / (value[0] + value[1])) * range,
          lossRate: (value[1] / (value[0] + value[1])) * range,
        });
    });

    const dateStrToResults = results.reduce((prev, current) => {
      if (!current.date) {
        return prev;
      }
      const dateStr = current.date.substring(0, 10);
      const value = prev.get(dateStr) || [];
      value.push(current);
      prev.set(dateStr, value);
      return prev;
    }, new Map<string, Result[]>());
    return [
      rateRangeToWinnersAndLosers,
      rateRangeToWinLoss,
      ret,
      dateStrToResults,
    ];
  }, [playerId, results, range]);
  if (
    rateRangeToWinLoss == undefined ||
    data == undefined ||
    rateRangeToWinnersAndLosers == undefined ||
    dateStrToResults == undefined
  ) {
    return (
      <div className="mt-32 flex justify-center" aria-label="読み込み中">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const handleBarClick = (data: any) => {
    const rateRange = Number(data.name) || NO_DATA_KEY;
    setShowingModalRateRange(rateRange);
    setIsModalOpen(true);
  };

  return (
    <div>
      <ResponsiveContainer
        height={data.length * 35}
        style={{ fontFamily: 'monospace' }}
      >
        <BarChart
          layout="vertical"
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
              const s = value === NO_DATA_KEY ? '' : '~';
              const winLoss =
                value === NO_DATA_KEY
                  ? rateRangeToWinLoss.get(NO_DATA_KEY)
                  : rateRangeToWinLoss.get(Number(value));
              if (winLoss) {
                const [win, loss] = winLoss;
                return `${value}${s} ${win}勝${loss}敗`;
              } else {
                return `${value}${s}`;
              }
            }}
          />

          <Bar
            className="cursor-pointer"
            dataKey="winRate"
            fill="#82ca9d"
            stackId="a"
            onClick={handleBarClick}
          />

          <Bar
            className="cursor-pointer"
            dataKey="lossRate"
            fill="#FF6969"
            stackId="a"
            onClick={handleBarClick}
          />
          <ReferenceLine x={50} stroke="#AAAAAA" isFront={false} />
        </BarChart>
      </ResponsiveContainer>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="my-10 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <WinLossPlayersModal
                    title={
                      showingModalRateRange == NO_DATA_KEY
                        ? NO_DATA_KEY
                        : `レート ${showingModalRateRange} ~ ${
                            showingModalRateRange + (range - 1)
                          }`
                    }
                    season={seasonRow.season}
                    winners={
                      rateRangeToWinnersAndLosers.get(showingModalRateRange)
                        ?.winners || []
                    }
                    losers={
                      rateRangeToWinnersAndLosers.get(showingModalRateRange)
                        ?.losers || []
                    }
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      閉じる
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ActivityChart
        playerId={playerId}
        dateStrToResults={dateStrToResults}
        seasonRow={seasonRow}
      />
    </div>
  );
}
