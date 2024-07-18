'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Select } from '@headlessui/react';
import { Season } from '../_lib/services/type';

const convertDateStr = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP').split('/').slice(0, 2).join('/');
};

export default function ChangeSeason({
  seasonRows,
  initialValue,
}: {
  seasonRows: Season[];
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
      onChange={(e) => handleChange(e.target.value)}
      defaultValue={initialValue}
      className="rounded"
    >
      {seasonRows.map((seasonRow) => {
        return (
          <option key={seasonRow.season} value={seasonRow.season}>{`シーズン ${
            seasonRow.season
          } (${convertDateStr(seasonRow.started_at)} 〜)`}</option>
        );
      })}
    </Select>
  );
}
