'use client';

import VisitPlayer from '@/app/_components/VisitPlayer';
import { Account } from '@/app/_lib/services/type';

export const PlayerPageHeader = ({
  account,
  season,
  withSmashmateLink,
}: {
  account: Account;
  season?: string;
  withSmashmateLink?: boolean;
}) => {
  return (
    // The value of "top-10" depends on the height of RootHeader
    <div className="sticky top-10 z-10 bg-white">
      <div className="mx-2 flex items-end justify-between pt-2">
        <VisitPlayer
          playerName={account.playerName}
          playerId={account.playerId}
        />
        <h1 className="text-4xl font-semibold">{`${account.playerName}`}</h1>
        {season != null && <div>{`シーズン ${season}`}</div>}
        {withSmashmateLink && (
          <a
            href={`https://smashmate.net/user/${account.playerId}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            スマメイト(本家)のページへ
          </a>
        )}
      </div>
      <hr className="my-4 border-2 border-slate-300" />
    </div>
  );
};
