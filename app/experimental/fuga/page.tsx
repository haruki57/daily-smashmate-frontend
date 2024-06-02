export default async function Page() {
  // Since this page is dynamic, it will run through a Vercel Function
  const startTime = Date.now();
  const dynamic = await fetch(
    'https://daily-smashmate-frontend.vercel.app/api/experimental/getTime/hoge',
    {
      cache: 'no-store',
    },
  );
  const fetchTime = Date.now() - startTime;
  const products = await dynamic.json();

  // Cache the static data and avoid slow origin fetches
  const startTime2 = Date.now();
  const _static = await fetch(
    'https://daily-smashmate-frontend.vercel.app/api/experimental/getTime/fuga',
    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  );
  const fetchTime2 = Date.now() - startTime2;
  const blog = await _static.json();

  return (
    <>
      <div>{`FetchTime1: ${fetchTime}`}</div>
      <div>{JSON.stringify(products)}</div>
      <div>{`FetchTime2: ${fetchTime2}`}</div>
      <div>{JSON.stringify(blog)}</div>
    </>
  );
}
