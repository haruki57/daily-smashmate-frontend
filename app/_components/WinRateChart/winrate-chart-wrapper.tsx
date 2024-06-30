'use client';

import { Result } from '@/app/_lib/services/type';
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

// Note: https://blog.mmmcorp.co.jp/2023/08/29/react-recharts/

type Props = {
  playerId: number;
  results: Result[];
};

type Opponent = {
  playerId: number;
  playerName: string;
  count: number;
  fighters: string[];
};

const NO_DATA_KEY = 'データ無し';
type NO_DATA_KEY = 'データ無し';

export default function WinRateChartWrapper({ playerId, results }: Props) {
  const [range, setRange] = useState<number>(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rateRange, setRateRange] = useState<number | NO_DATA_KEY>(1500);
  const [showCharactersOnly, setShowCharactersOnly] = useState<boolean>(false);

  const [rateRangeToWinnersAndLosers, rateRangeToWinLoss, data] =
    useMemo(() => {
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
        const found = list.find((l) => l.playerId === opponentId);
        if (found) {
          found.count++;
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
      return [rateRangeToWinnersAndLosers, rateRangeToWinLoss, ret];
    }, [playerId, results, range]);
  if (
    rateRangeToWinLoss == undefined ||
    data == undefined ||
    rateRangeToWinnersAndLosers == undefined
  ) {
    return (
      <div className="mt-32 flex justify-center" aria-label="読み込み中">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const handleBarClick = (data: any) => {
    const rateRange = Number(data.name) || NO_DATA_KEY;
    setRateRange(rateRange);
    setIsModalOpen(true);
  };

  const WinLossPlayers = () => {
    const winnersAndLosers = rateRangeToWinnersAndLosers.get(rateRange);
    if (!winnersAndLosers) {
      return;
    }
    const { winners, losers } = winnersAndLosers;

    const playerElem = (player: Opponent) => {
      return (
        <div key={player.playerId} className="flex text-sm text-gray-600">
          <div>{player.playerName + '×' + player.count}</div>
          <div>
            <CharacterImages charactersCsv={player.fighters.join(',')} />
          </div>
        </div>
      );
    };

    const CharactersElem = ({ players }: { players: Opponent[] }) => {
      const charaCnt: { [key in string]: number } = {};
      players.forEach((player) => {
        if (player.fighters.length >= 2) {
          return;
        }
        player.fighters.forEach((fighter) => {
          if (fighter.trim() === '') {
            return;
          }
          if (fighter.startsWith('!')) {
            return;
          }
          charaCnt[fighter] = (charaCnt[fighter] ?? 0) + player.count;
        });
      });
      const charaSorted = Object.entries(charaCnt).sort((a, b) => b[1] - a[1]);
      return (
        <div>
          {charaSorted.map(([charaId, count]) => {
            const charaIdList: string[] = [];
            for (let i = 0; i < count; i++) {
              charaIdList.push(charaId);
            }
            return charaIdList.map((charaId, index) => {
              return (
                <Image
                  key={`${charaId}-${index}`}
                  src={`/characters/${charaId}.png`}
                  alt={charaId}
                  width={24}
                  height={24}
                  style={{ display: 'inline' }}
                />
              );
            });
          })}
        </div>
      );
    };

    return (
      <div>
        <DialogTitle
          as="h3"
          className="mb-4 text-2xl font-medium leading-6 text-gray-900"
        >
          {rateRange == NO_DATA_KEY
            ? NO_DATA_KEY
            : `レート ${rateRange} ~ ${rateRange + (range - 1)}`}
        </DialogTitle>

        <div
          onClick={() => setShowCharactersOnly((prev) => !prev)}
          className="my-2 flex cursor-pointer items-center"
        >
          <Checkbox
            checked={showCharactersOnly}
            className="size-4 group block h-4 w-4 rounded border bg-white data-[checked]:bg-blue-500"
          >
            <svg
              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 8L6 11L11 3.5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Checkbox>
          <div>キャラクターのみ表示</div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="mb-2 text-lg">勝ち</div>
            {showCharactersOnly ? (
              <CharactersElem players={winners} />
            ) : (
              winners.map(playerElem)
            )}
          </div>
          <div className="w-1/2">
            <div className="mb-2 text-lg">負け</div>
            {showCharactersOnly ? (
              <CharactersElem players={losers} />
            ) : (
              losers.map(playerElem)
            )}
          </div>
        </div>
      </div>
    );
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
                  <WinLossPlayers />
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
    </div>
  );
}
