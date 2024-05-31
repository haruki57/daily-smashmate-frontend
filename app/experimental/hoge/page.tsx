import { getCurrentTime } from '@/app/_lib/services/getCurrentTime';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    season?: string;
  };
}) {
  const hoge = await getCurrentTime(searchParams?.season ?? 'default');
  return <div>{`${JSON.stringify(hoge)} ${searchParams?.season}`}</div>;
}
