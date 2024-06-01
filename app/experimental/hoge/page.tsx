import { getCurrentTime } from '@/app/_lib/services/getCurrentTime';
//export const runtime = 'edge';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    season?: string;
  };
}) {
  const startTime = Date.now();
  const hoge = await getCurrentTime(searchParams?.season ?? 'default');
  const fetchTime = Date.now() - startTime;
  return (
    <div>
      <div>{`Fetch time: ${fetchTime}ms`}</div>
      <div>{`${new Date(hoge.timestamp).getSeconds()} ${JSON.stringify(
        hoge,
      )} ${searchParams?.season}`}</div>
    </div>
  );
}
