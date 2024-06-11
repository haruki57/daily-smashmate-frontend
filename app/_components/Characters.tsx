'use client';

import { getTop200 } from '../_lib/services/getTop200';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  charactersCsv?: string | null;
  size?: number;
};

export default function CharacterImages({ charactersCsv, size = 24 }: Props) {
  if (!charactersCsv) {
    return undefined;
  }
  return (
    <div className="flex">
      {charactersCsv.split(',').map((characterId) => {
        if (characterId.indexOf('!') >= 0) {
          return undefined;
        }
        return (
          <Image
            key={`${characterId}`}
            src={`/characters/${characterId}.png`}
            alt={characterId}
            width={size}
            height={size}
            style={{ height: `${size}px` }}
          />
        );
      })}
    </div>
  );
}
