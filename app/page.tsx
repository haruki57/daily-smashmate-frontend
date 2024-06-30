import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from './ui/fonts';
import Image from 'next/image';
import Top200 from './_components/Top200';
import VisitedPlayers from './_components/VisitedPlayers';
import TopMatchCount from './_components/TopMatchCount';
import { getSeasons } from './_lib/services/getSeasons';
import ChangeSeason from './ui/change-season';

export default async function Page({
  searchParams,
}: {
  searchParams: { season: string };
}) {
  const seasons = await getSeasons();
  const latestSeason = seasons.at(-1)?.season!;
  const season = searchParams.season || latestSeason;
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <p className="mb-4  text-center">
        デイリースマメイトは、スマメイト27期以降の戦績を閲覧できるサービスです。
      </p>
      <div>
        <div className="mb-4 flex w-full justify-end">
          <ChangeSeason
            seasons={seasons.map((s) => s.season).reverse()}
            initialValue={searchParams.season}
          />
        </div>
        <div className="grid  grid-cols-1 justify-center gap-4 md:justify-normal lg:grid-cols-2">
          <TopMatchCount season={season} />
          <Top200 season={season} />
          <VisitedPlayers />
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent" />
          {/* <div className={styles.shape} /> */}

          <p
            className={`text-xl text-gray-800 md:text-3xl md:leading-normal ${lusitana.className}`}
          >
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}
