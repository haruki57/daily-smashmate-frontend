'use client';

import Link from 'next/link';
import { getVisitedPlayers } from '../lib/localStorage';

export default function VisitedPlayers() {
  const visitedPlayers = getVisitedPlayers().reverse();
  return (
    <div className="max-h-96 w-96 overflow-y-scroll rounded border border-slate-400 px-4 py-3">
      <h4 className="mb-4 text-xl font-semibold">ページ訪問履歴</h4>
      <div>
        {visitedPlayers.map(({ playerName, playerId }, index) => {
          return (
            <>
              {index !== 0 && <hr className="border-slate-300 " />}
              <div className="mt-3 text-blue-600">
                <Link href={`/players/${playerId}`}>{playerName}</Link>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
