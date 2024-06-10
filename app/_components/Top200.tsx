import { getTop200 } from '../_lib/services/getTop200';
import Image from 'next/image';
import Link from 'next/link';

export default async function Top200() {
  const top200 = await getTop200();
  return (
    <div className="max-h-96 w-96 overflow-y-scroll rounded border border-slate-400 px-4 py-3">
      {top200.map((player, index) => {
        if (!player.accountInfo) {
          return undefined;
        }
        return (
          <div key={player.playerId}>
            {index !== 0 && <hr className="border-slate-300 " />}
            <div className="mt-2 flex">
              <div className="basis-2/12">{`${player.rank} 位`}</div>

              <div className="basis-5/12 text-blue-600">
                <Link href={`/players/${player.playerId}`}>
                  {player.accountInfo.playerName}
                </Link>
              </div>

              <div className="flex basis-3/12">
                {player.currentCharactersCsv.split(',').map((characterId) => {
                  if (characterId.indexOf('!') >= 0) {
                    return undefined;
                  }
                  return (
                    <Image
                      key={`${characterId}`}
                      src={`/characters/${characterId}.png`}
                      alt={characterId}
                      width={24}
                      height={24}
                      style={{ height: '24px' }}
                    />
                  );
                })}
              </div>
              <div className="basis-2/12">{player.rate}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
