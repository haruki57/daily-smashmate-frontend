import { getCurrentTime } from '@/app/_lib/services/getCurrentTime';
export const runtime = 'edge';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    season?: string;
  };
}) {
  const hoge = await getCurrentTime(searchParams?.season ?? 'default');
  return (
    <div>{`${new Date(hoge.timestamp).getSeconds()} ${JSON.stringify(
      hoge,
    )} ${searchParams?.season}`}</div>
  );
}
