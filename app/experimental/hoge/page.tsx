import { getCurrentTime } from '@/app/_lib/services/getCurrentTime';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    season?: string;
  };
}) {
  const hoge = await getCurrentTime();
  return <div>{`${hoge.timestamp} ${searchParams?.season}`}</div>;
}
