'use client';

import Image from 'next/image';

type Props = {
  charactersCsv?: string | null;
  size?: number;
};

export default function CharacterImages({ charactersCsv, size = 24 }: Props) {
  if (!charactersCsv) {
    return undefined;
  }
  return (
    <div>
      {charactersCsv.split(',').map((characterId) => {
        if (characterId.indexOf('!') >= 0) {
          return undefined;
        }
        return (
          <Image
            key={`${characterId}`}
            src={`/fighters/${characterId}.png`}
            alt={characterId}
            width={size}
            height={size}
            style={{ height: `${size}px` }}
            className="inline"
          />
        );
      })}
    </div>
  );
}
