import { getTop200 } from '../_lib/services/getTop200';
import Link from 'next/link';
import CharacterImages from './Characters';

export default async function Top200() {
  const top200 = await getTop200();
  return (
    <div className="max-h-96 w-96 overflow-y-scroll rounded border border-slate-400 px-4 py-3">
      <h4 className="mb-4 text-xl font-semibold">レートランキング</h4>
      {top200.map((player, index) => {
        if (!player.accountInfo) {
          return undefined;
        }
        return (
          <div key={player.playerId}>
            {index !== 0 && <hr className="border-slate-300 " />}
            <div className="mt-2 flex tabular-nums">
              <div className="flex basis-2/12 justify-around">
                <div className="basis-6 text-right">{player.rank}</div>
                <div className="mr-2">位</div>
              </div>

              <div className="basis-5/12 text-blue-600">
                <Link href={`/players/${player.playerId}`}>
                  {player.accountInfo.playerName}
                </Link>
              </div>

              <div className="flex basis-3/12">
                <CharacterImages charactersCsv={player.currentCharactersCsv} />
              </div>
              <div className="basis-2/12 tabular-nums">{player.rate}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
