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
import CharacterImages from '../Characters';
import { date } from 'zod';
import { WinLossPlayersModal } from './WinLossPlayersModal';
import { Opponent } from './results-chart-client';
import clsx from 'clsx';
import styles from './gridTemplateRows.module.css';

const monthNumToEng = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
} as { [key in number]: string };

// getDate()=0 is Sunday
type Props = {
  playerId: number;
  dateStrToResults: Map<string, Result[]>;
  seasonRow: Season;
};

type GetOpponentsProps = {
  dateStrToResults: Map<string, Result[]>;
  dateStr: string;
  playerId: number;
  isWinners: boolean;
};

const getOpponents = ({
  dateStrToResults,
  dateStr,
  playerId,
  isWinners,
}: GetOpponentsProps): Opponent[] => {
  const results = dateStrToResults.get(dateStr);
  if (!results) {
    return [];
  }

  const ret = Array.from(
    results
      .filter((r) => {
        if (isWinners) {
          return r.winnerId === playerId;
        } else {
          return r.loserId === playerId;
        }
      })
      .reduce((prev, current) => {
        const opponentId = isWinners ? current.loserId : current.winnerId;
        const opponent = prev.get(opponentId) || {
          playerId,
          playerName: current.playerName || '【退会済み】',
          count: 0,
          fighters: current.currentCharactersCsv?.split(',') || [],
        };
        opponent.count++;
        prev.set(opponentId, opponent);
        return prev;
      }, new Map<number, Opponent>())
      .values(),
  ).sort((a, b) => b.count - a.count);
  return ret;
};

export default function ActivityChart({
  playerId,
  dateStrToResults,
  seasonRow,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateStrForModal, setDateStrForModal] = useState<string>('');
  const [onlyWins, setOnlyWins] = useState(false);
  const minDate = new Date(seasonRow.started_at);
  const maxDate =
    seasonRow.ended_at != null ? new Date(seasonRow.ended_at) : new Date();
  minDate.setDate(minDate.getDate() - minDate.getDay());
  const allDates: Date[] = [];
  for (let i = minDate; i <= maxDate; i.setDate(i.getDate() + 1)) {
    allDates.push(new Date(i.getTime()));
  }

  const monthColNum = {
    Jan: -1,
    Feb: -1,
    Mar: -1,
    Apr: -1,
    May: -1,
    Jun: -1,
    Jul: -1,
    Aug: -1,
    Sep: -1,
    Oct: -1,
    Nov: -1,
    Dec: -1,
  } as { [key in string]: number };
  for (let i = 0; i < allDates.length; i++) {
    const date = allDates[i];
    const colNum = Math.trunc(i / 7);
    const month = date.getMonth() + 1;
    const dateNum = date.getDate();
    const monthEng = monthNumToEng[month];
    if (dateNum === 1) {
      monthColNum[monthEng] = colNum;
    }
  }
  const monthObj = Object.entries(monthColNum)
    .filter(([_, colNum]) => colNum !== -1)
    .map(([monthEng, colNum]) => {
      return {
        monthEng,
        colNum,
      };
    });

  return (
    <div>
      <h4 className="mb-4 mt-12 text-2xl font-bold">日別対戦記録</h4>
      <div className="relative overflow-x-scroll rounded border pb-8 pl-4 pt-12">
        <div className="absolute text-lg" style={{ top: '4.8rem' }}>
          Mon
        </div>
        <div className="absolute text-lg" style={{ top: '8.8rem' }}>
          Wed
        </div>
        <div className="absolute text-lg" style={{ top: '12.8rem' }}>
          Fri
        </div>
        {monthObj.map(({ monthEng, colNum }) => {
          return (
            <div
              key={monthEng}
              className="absolute text-lg"
              style={{
                top: '1.0rem',
                left: colNum * 2 + 3 + '.8rem',
              }}
            >
              {monthEng}
            </div>
          );
        })}
        <div
          className={clsx(
            'mx-12 grid grid-flow-col justify-start gap-2',
            styles.gridTemplateRows,
          )}
        >
          {allDates.map((date) => {
            if (date < new Date(seasonRow.started_at)) {
              return (
                <div
                  key={date.toISOString()}
                  className={`h-6 w-6 rounded `}
                ></div>
              );
            }
            const dateStr = date.toISOString().substring(0, 10);
            const results = dateStrToResults.get(dateStr) || [];
            let borderColor, bgColor;
            if (results.length >= 10) {
              borderColor = 'border-green-600';
              bgColor = 'bg-green-500';
            } else if (results.length >= 6) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-400';
            } else if (results.length >= 3) {
              borderColor = 'border-green-400';
              bgColor = 'bg-green-300';
            } else if (results.length >= 1) {
              borderColor = 'border-green-300';
              bgColor = 'bg-green-200';
            } else {
              borderColor = 'border-gray-300';
              bgColor = 'bg-gray-200';
            }
            return (
              <div
                key={date.toISOString()}
                className={clsx([
                  `h-6 w-6 rounded border-2 ${borderColor} ${bgColor}`,
                  results.length > 0 && 'hover:cursor-pointer',
                ])}
                onClick={() => {
                  if (results.length > 0) {
                    setDateStrForModal(dateStr);
                    setIsModalOpen(true);
                  }
                }}
              ></div>
            );
          })}
          {/* Hack: Because padding-right with overflow-x doesn't work, 
              here I manually add empty 1-col rectangles to pad right space
           */}
          {Array.from({ length: 7 }).map((_, idx) => {
            return <div key={idx} className={`h-6 w-6 rounded `}></div>;
          })}
        </div>
        <div className="ml-4 mt-2">
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded border-2 border-green-500 bg-green-600"></div>
            <div>10対戦以上</div>
          </div>
          <div className="mt-0.5 flex gap-2 ">
            <div className="h-6 w-6 rounded border-2 border-green-400 bg-green-500"></div>
            <div>6対戦以上</div>
          </div>
          <div className="mt-0.5 flex gap-2 ">
            <div className="h-6 w-6 rounded border-2 border-green-300 bg-green-400"></div>
            <div>3対戦以上</div>
          </div>
          <div className="mt-0.5 flex gap-2 ">
            <div className="h-6 w-6 rounded border-2 border-green-200 bg-green-300"></div>
            <div>1対戦以上</div>
          </div>
        </div>
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
                      title={dateStrForModal}
                      winners={getOpponents({
                        dateStrToResults,
                        dateStr: dateStrForModal,
                        playerId,
                        isWinners: true,
                      })}
                      losers={getOpponents({
                        dateStrToResults,
                        dateStr: dateStrForModal,
                        playerId,
                        isWinners: false,
                      })}
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
      </div>
    </div>
  );
}
