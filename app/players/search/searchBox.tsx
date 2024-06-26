'use client';

import { Input } from '@headlessui/react';
import { usePlayerData } from '@/app/lib/hooks/usePlayerData';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import CharacterImages from '@/app/_components/Characters';

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
    <div className=" mx-auto flex w-full max-w-md flex-col ">
      <h2 className="my-4 text-3xl">プレイヤー検索</h2>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border data-[focus]:bg-blue-100 data-[hover]:shadow"
      />
      {filteredPlayerData.map((data) => {
        const { id, name, fighters, mId } = data;
        return (
          <div key={id} className="my-2 w-8/12">
            <Link href={`/players/${id}`}>
              <div className="flex  items-center justify-between">
                <div className="">
                  {name}
                  {mId != null && (
                    <span className="ml-1 text-sm text-blue-400">サブ</span>
                  )}
                </div>
                <div className="">
                  <CharacterImages charactersCsv={fighters} />
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      {/* <Field>
        <Description className="text-sm/6 ">
          見つからない場合は、スマメイトIDを入力してください
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
      </Field> */}
    </div>
  );
}
