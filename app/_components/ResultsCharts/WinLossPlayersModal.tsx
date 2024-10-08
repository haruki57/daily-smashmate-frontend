import Image from 'next/image';
import CharacterImages from '../Characters';
import { Checkbox, DialogTitle } from '@headlessui/react';
import { NO_DATA_KEY, Opponent } from './results-chart-client';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  winners: Opponent[];
  losers: Opponent[];
  season: string;
};

export const WinLossPlayersModal = ({
  title,
  winners,
  losers,
  season,
}: Props) => {
  const [showCharactersOnly, setShowCharactersOnly] = useState<boolean>(false);

  const playerElem = (player: Opponent) => {
    return (
      <Link
        href={`/players/${player.playerId}/${season}`}
        key={player.playerId}
        className="my-2 flex w-fit items-center text-sm text-blue-500"
      >
        <div className="mr-1">
          <span>{player.playerName || '_'}</span>
          <span className="text-gray-600">{` ×  ${player.count}`}</span>
        </div>
        <div>
          <CharacterImages charactersCsv={player.fighters.join(',')} />
        </div>
      </Link>
    );
  };

  const CharactersElem = ({ players }: { players: Opponent[] }) => {
    const charaCnt: { [key in string]: number } = {};
    players.forEach((player) => {
      const filteredFighters = player.fighters.filter(
        (f) => !f.startsWith('!'),
      );
      if (filteredFighters.length >= 2) {
        return;
      }
      filteredFighters.forEach((fighter) => {
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
                src={`/fighters/${charaId}.png`}
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
        {title}
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
