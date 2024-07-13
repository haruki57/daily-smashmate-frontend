'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function ChangeRate({
  value,
  max,
  min,
}: {
  value: number;
  max: number;
  min: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (rate: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('rate', String(rate));
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <input
      type="number"
      onChange={(e) => handleChange(Number(e.target.value))}
      defaultValue={value}
      max={max}
      min={min}
      className="rounded text-center text-6xl font-bold"
    ></input>
  );
}
