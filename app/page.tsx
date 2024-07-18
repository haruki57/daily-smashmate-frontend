import Top200 from './_components/Top200';
import VisitedPlayers from './_components/VisitedPlayers';
import TopMatchCount from './_components/TopMatchCount';
import { getSeasons } from './_lib/services/getSeasons';
import ChangeSeason from './ui/change-season';
import RateBorder from './_components/RateBorder';

export default async function Page({
  searchParams,
}: {
  searchParams: { season: string };
}) {
  const seasons = await getSeasons();
  const latestSeason = seasons.at(-1)?.season!;
  const season = searchParams.season || latestSeason;
  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-2">
      <div className="mb-4 flex w-full justify-end">
        <ChangeSeason
          seasonRows={seasons.reverse()}
          initialValue={searchParams.season}
        />
      </div>
      <div className="my-8 flex w-full flex-col items-center md:my-16">
        <RateBorder season={season} />
      </div>
      <p className="mb-4 text-center">
        デイリースマメイトは、スマメイト27期以降の戦績を閲覧できるサービスです。
      </p>

      <div className="grid grid-cols-1 justify-center gap-4 md:justify-normal lg:grid-cols-2">
        <TopMatchCount season={season} />
        <Top200 season={season} />
        <VisitedPlayers />
      </div>
    </main>
  );
}
