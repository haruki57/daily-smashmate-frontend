import { Metadata } from 'next';
import SearchBox from './searchBox';

export const metadata: Metadata = {
  title: 'プレイヤー検索',
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    season?: string;
  };
}) {
  return (
    <>
      <SearchBox />
    </>
  );
}
