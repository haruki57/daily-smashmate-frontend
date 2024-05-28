import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Select } from '@headlessui/react';
import { PrismaClient } from '@prisma/client';
import { getPlayerIdsToRateMap } from '@/app/lib/data';
const prisma = new PrismaClient();

export default async function Heatmap({ data }: { data: Map<string, number> }) {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const date = new Date(oneYearAgo);

  const dateStrList: string[] = [];
  for (let i = 0; ; i++) {
    date.setDate(date.getDate() + 1);
    if (now.getTime() < date.getTime()) {
      break;
    }
    dateStrList.push(date.toISOString().substring(0, 10));
  }
  console.log(data);
  return (
    <>
      {dateStrList.map((dateStr) => {
        return (
          <div key={dateStr}>{dateStr + ' ' + (data.get(dateStr) || 0)}</div>
        );
      })}
    </>
  );
}
