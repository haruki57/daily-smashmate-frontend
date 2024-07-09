import { Metadata } from 'next';
import SearchBox from './searchBox';

export const metadata: Metadata = {
  title: 'プレイヤー検索',
  description:
    'デイリースマメイトは、スマメイト27期以降の戦績を閲覧できるサービスです。',
  metadataBase: process.env.URL ? new URL(process.env.URL) : undefined,
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
