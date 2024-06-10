'use client';

import Link from 'next/link';
import { getVisitedPlayers } from '../lib/localStorage';

export default function VisitedPlayers() {
  const visitedPlayers = getVisitedPlayers();
  return (
    <div className="max-h-96 w-96 overflow-y-scroll rounded border border-slate-400 px-4 py-3">
      <div>ページ訪問履歴</div>
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
