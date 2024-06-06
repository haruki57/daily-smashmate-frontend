import SearchBox from './searchBox';

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
