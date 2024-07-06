'use client';

import VisitPlayer from '@/app/_components/VisitPlayer';
import { Account } from '@/app/_lib/services/type';
import Link from 'next/link';

export const PlayerPageHeader = ({
  account,
  season,
  linkToTopPlayerPage,
  withSmashmateLink,
}: {
  account: Account;
  season?: string;
  linkToTopPlayerPage?: boolean;
  withSmashmateLink?: boolean;
}) => {
  return (
    // The value of "top-10" depends on the height of RootHeader
    <div className="sticky top-10 z-10 bg-white">
      <div className="mx-4 items-end pt-2">
        <VisitPlayer
          playerName={account.playerName}
          playerId={account.playerId}
        />
        <h1 className="text-2xl font-semibold">
          {linkToTopPlayerPage ? (
            <Link href={`/players/${account.playerId}`}>{`${
              account.playerName || '_'
            }`}</Link>
          ) : (
            `${account.playerName || '_'}`
          )}
        </h1>
        <div className="flex justify-end text-sm">
          {season != null && <div>{`シーズン ${season}`}</div>}
          {withSmashmateLink && (
            <a
              href={`https://smashmate.net/user/${account.playerId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              スマメイトのページへ
            </a>
          )}
        </div>
      </div>
      <hr className="my-2 mb-4 border-2 border-slate-300" />
    </div>
  );
};
