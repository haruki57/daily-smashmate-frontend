'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Description, Field, Input, Select } from '@headlessui/react';
import { PrismaClient } from '@prisma/client/edge';
import { getPlayerIdsToRateMap } from '@/app/lib/data';
import RatingHistogram from '@/app/_components/RatingHistogram';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { getResults } from '@/app/_lib/services/getResults';
import { getPlayerRates } from '@/app/_lib/services/getPlayerRates';
import WinRateChart from '@/app/_components/WinRateChart';
import { getRank } from '@/app/_lib/services/getRank';
import { getTop200 } from '@/app/_lib/services/getTop200';
import { getTotalPlayers } from '@/app/_lib/services/getTotalPlayers/[season]';
import { usePlayerData } from '@/app/lib/hooks/usePlayerData';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Button } from '@/app/ui/button';
import { characterMap } from '@/app/lib/characters';
import CharacterImages from '@/app/_components/Characters';
const prisma = new PrismaClient();

function normalize(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, function (match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
}

export default function SearchBox() {
  const playerData = usePlayerData();
  const [text, setText] = useState('');
  const [smashmateId, setSmashmateId] = useState('');

  const filteredPlayerData = useMemo(() => {
    if (text.trim() === '' || !playerData) {
      return [];
    }
    return playerData
      .filter((d) => {
        return (
          normalize(d.name).indexOf(normalize(text)) >= 0 ||
          normalize(d.alias).indexOf(normalize(text)) >= 0
        );
      })
      .slice(0, 30);
  }, [playerData, text]);

  return (
    <div>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border data-[focus]:bg-blue-100 data-[hover]:shadow"
      />
      {filteredPlayerData.map((data) => {
        const { id, name, fighters, mId } = data;
        return (
          <div key={id}>
            <Link href={`/players/${id}`}>
              <div className="flex items-center">
                <div className="basis-4/12">{name}</div>
                <div className="basis-6/12 text-sm ">
                  <CharacterImages charactersCsv={fighters} />
                </div>
                {mId != null && (
                  <div className="basis-2/12 text-sm text-blue-400">サブ</div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
      <Field>
        <Description className="text-sm/6 ">
          見つからない場合は、スマメイトIDを直接入力してください
        </Description>
        <div className="flex">
          <Input
            value={smashmateId}
            onChange={(e) => {
              setSmashmateId(e.target.value);
            }}
            className={clsx(
              'mt-3 block   px-3 py-1.5 text-sm/6 ',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 ',
            )}
          />
          <Link href={`/players/${smashmateId}`}>
            <Button disabled={!smashmateId.trim().match(/\d/)}>hoge</Button>
          </Link>
        </div>
      </Field>
    </div>
  );
}
