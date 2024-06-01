export default async function Page() {
  // Since this page is dynamic, it will run through a Vercel Function
  const startTime = Date.now();
  const dynamic = await fetch('https://api.vercel.app/products', {
    cache: 'no-store',
  });
  const fetchTime = Date.now() - startTime;
  const products = await dynamic.json();

  // Cache the static data and avoid slow origin fetches
  const startTime2 = Date.now();
  const _static = await fetch('https://api.vercel.app/blog', {
    next: {
      revalidate: 3600, // 1 hour
    },
  });
  const fetchTime2 = Date.now() - startTime;
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
