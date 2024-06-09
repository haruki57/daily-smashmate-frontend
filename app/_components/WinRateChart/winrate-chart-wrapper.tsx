'use client';

import { PlayerDataElem, PlayerDataJson } from '@/app/_lib/services/type';
import { usePlayerData } from '@/app/lib/hooks/usePlayerData';
import { usePlayerRates } from '@/app/lib/hooks/usePlayerRates';
import {
  Checkbox,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { PrismaClient } from '@prisma/client/edge';
import Image from 'next/image';
import { Fragment, useMemo, useState } from 'react';
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
  season: string;
  seasonForOpponentRates: string;
};

type Opponent = {
  playerId: number;
  playerName: string;
  count: number;
  fighters: string[];
};

export default function WinRateChartWrapper({
  playerId,
  results,
  season,
  seasonForOpponentRates,
}: Props) {
  const playerRates = usePlayerRates(seasonForOpponentRates);
  const playerData = usePlayerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rateRange, setRateRange] = useState(1500);
  const [showCharactersOnly, setShowCharactersOnly] = useState<boolean>(false);

  const playerIdToData = useMemo(() => {
    if (!playerData) {
      return undefined;
    }
    const ret: { [key in number]: PlayerDataElem } = {};
    playerData.forEach((d) => {
      ret[d.id] = d;
    });
    return ret;
  }, [playerData]);

  const [rateRangeToWinnersAndLosers, rateRangeToWinLoss, data] =
    useMemo(() => {
      if (!playerRates || !playerIdToData) {
        return [undefined, undefined];
      }
      const playerIdToRate = new Map<number, number>();
      Object.entries(playerRates).forEach(([playerIdStr, currentRate]) => {
        const playerId = Number(playerIdStr);
        playerIdToRate.set(playerId, currentRate);
      });

      let min = 99999;
      let max = -1;
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
        if (
          playerId === winnerId &&
          playerIdToRate.get(loserId) !== undefined
        ) {
          const rateRange =
            playerIdToRate.get(loserId)! - (playerIdToRate.get(loserId)! % 100);
          rateRangeToWinLoss.get(rateRange)![0]++;
        } else if (
          playerId === loserId &&
          playerIdToRate.get(winnerId) !== undefined
        ) {
          const rateRange =
            playerIdToRate.get(winnerId)! -
            (playerIdToRate.get(winnerId)! % 100);
          rateRangeToWinLoss.get(rateRange)![1]++;
        }
      });

      const rateRangeToWinnersAndLosers = new Map<
        number,
        { winners: Opponent[]; losers: Opponent[] }
      >();
      results.forEach((result) => {
        const { winnerId, loserId } = result;
        let rateRange: number | undefined = undefined;
        let opponentId: number | undefined = undefined;
        if (
          playerId === winnerId &&
          playerIdToRate.get(loserId) !== undefined
        ) {
          rateRange =
            playerIdToRate.get(loserId)! - (playerIdToRate.get(loserId)! % 100);
          opponentId = loserId;
        } else if (
          playerId === loserId &&
          playerIdToRate.get(winnerId) !== undefined
        ) {
          rateRange =
            playerIdToRate.get(winnerId)! -
            (playerIdToRate.get(winnerId)! % 100);
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
        } else if (playerIdToData[opponentId]) {
          list.push({
            playerId: opponentId,
            playerName: playerIdToData[opponentId].name,
            count: 1,
            fighters: playerIdToData[opponentId].fighters?.split(',') || [],
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
            winRate: (value[0] / (value[0] + value[1])) * 100,
            lossRate: (value[1] / (value[0] + value[1])) * 100,
          });
      });
      return [rateRangeToWinnersAndLosers, rateRangeToWinLoss, ret];
    }, [playerId, results, playerRates, playerIdToData]);
  if (
    rateRangeToWinLoss == undefined ||
    data == undefined ||
    playerIdToData == undefined ||
    rateRangeToWinnersAndLosers == undefined
  ) {
    return <div>読込中...</div>;
  }

  const handleBarClick = (data: any) => {
    const rateRange = Number(data.name);
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
        <div key={player.playerId} className="text-sm text-gray-600">
          <div>{player.playerName + '×' + player.count}</div>

          {player.fighters.map((fighter) => {
            if (fighter.trim() === '') {
              return;
            }
            if (fighter.startsWith('!')) {
              return;
            }
            return (
              <div key={fighter}>
                <Image
                  src={`/characters/${fighter}.png`}
                  alt={fighter}
                  width={24}
                  height={24}
                />
              </div>
            );
          })}
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
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {`レート ${rateRange} ~ ${rateRange + 99}`}
        </DialogTitle>
        {/* Fighters data are not correct on Season 27 */}
        {season !== '27' && (
          <div
            onClick={() => setShowCharactersOnly((prev) => !prev)}
            className="flex cursor-pointer items-center"
          >
            <Checkbox
              checked={showCharactersOnly}
              className="size-4 group block h-4 w-4 rounded border bg-white data-[checked]:bg-blue-500"
            >
              {/* Checkmark icon */}
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
        )}
        <div className="flex">
          <p>
            <div>勝ち</div>
            {showCharactersOnly ? (
              <CharactersElem players={winners} />
            ) : (
              winners.map(playerElem)
            )}
          </p>
          <p>
            <div>負け</div>
            {showCharactersOnly ? (
              <CharactersElem players={losers} />
            ) : (
              losers.map(playerElem)
            )}
          </p>
        </div>
      </div>
    );
  };

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
            const winLoss = rateRangeToWinLoss.get(Number(value));
            if (winLoss) {
              const [win, loss] = winLoss;
              return `${value}~ (${win}勝${loss}敗)`;
            } else {
              return `${value}~`;
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
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
