'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Select } from '@headlessui/react';

export default function ChangeSeason({ seasons }: { seasons: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (season: string) => {
    console.log(`Searching... ${season}`);

    const params = new URLSearchParams(searchParams);
    params.set('season', season);
    console.log(params.toString);
    console.log(`${pathname}?${params.toString()}`);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Select
      name="status"
      aria-label="Project status"
      onChange={(e) => handleChange(e.target.value)}
    >
      {seasons.map((season) => {
        return (
          <option key={season} value={season}>{`シーズン ${season}`}</option>
        );
      })}
    </Select>
  );
}
