import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Select } from '@headlessui/react';
import { PrismaClient } from '@prisma/client/edge';
import { getPlayerIdsToRateMap } from '@/app/lib/data';
import { getRateCumulativeCounts } from '@/app/_lib/services/getRateCumulativeCounts';
import ChartWrapper from './chart-wrapper';
const prisma = new PrismaClient();

type Props = {
  season: string;
};

export default async function RatingHistogram({ season }: Props) {
  const cumulativeCounts = await getRateCumulativeCounts({ season });
  return <ChartWrapper data={cumulativeCounts} />;
}
