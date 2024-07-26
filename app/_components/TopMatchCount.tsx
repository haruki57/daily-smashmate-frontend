import Link from 'next/link';
import CharacterImages from './Characters';
import { getTopMatchCount } from '../_lib/services/getTopMatchCount';
import { Season } from '../_lib/services/type';

export default async function TopMatchCount({ season }: { season: Season }) {
  const isSeasonFinished = season.ended_at != null;
  const cache = !isSeasonFinished;
  const topMatchCount = await getTopMatchCount({
    season: season.season,
    cache,
  });
  return (
    <div className="max-h-96 w-72 overflow-y-scroll rounded border border-slate-400 px-4 py-3 text-sm md:w-96 md:text-base">
      <h4 className="mb-4 text-xl font-semibold">対戦回数ランキング</h4>
      {topMatchCount.map((player, index) => {
        const { matchCount } = player;
        const truncatedCount = matchCount - (matchCount % 10);
        return (
          <div key={player.playerId}>
            {index !== 0 && <hr className="border-slate-300" />}
            <div className="mt-2 flex tabular-nums">
              <div className="flex basis-5/12 justify-center gap-2">
                <div>{truncatedCount}</div>
                <div className="mr-2">戦以上</div>
              </div>
              <div className="basis-4/12 text-blue-600">
                <Link href={`/players/${player.playerId}`}>
                  {player.playerName || '_'}
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
