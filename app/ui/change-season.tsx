'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Select } from '@headlessui/react';

export default function ChangeSeason({
  seasons,
  initialValue,
}: {
  seasons: string[];
  initialValue: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (season: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('season', season);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Select
      name="status"
      aria-label="Project status"
      onChange={(e) => handleChange(e.target.value)}
      defaultValue={initialValue}
    >
      {seasons.map((season) => {
        return (
          <option key={season} value={season}>{`シーズン ${season}`}</option>
        );
      })}
    </Select>
  );
}
