import Link from 'next/link';
import CharacterImages from './Characters';
import { getTopMatchCount } from '../_lib/services/getTopMatchCount';

export default async function TopMatchCount({ season }: { season: string }) {
  const topMatchCount = await getTopMatchCount({ season });
  return (
    <div className="max-h-96 w-96 overflow-y-scroll rounded border border-slate-400 px-4 py-3">
      {topMatchCount.map((player, index) => {
        const truncatedCount = player.matchCount - (player.matchCount % 100);
        return (
          <div key={player.playerId}>
            {index !== 0 && <hr className="border-slate-300 " />}
            <div className="mt-2 flex tabular-nums">
              <div className="flex basis-4/12 justify-around">
                <div className="basis-10 text-right">{truncatedCount}</div>
                <div className="mr-2">戦以上</div>
              </div>
              <div className="basis-5/12 text-blue-600">
                <Link href={`/players/${player.playerId}`}>
                  {player.playerName}
                </Link>
              </div>

              <div className="flex basis-3/12">
                <CharacterImages charactersCsv={player.currentCharactersCsv} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
