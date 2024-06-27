'use client';

import { useEffect } from 'react';
import { addVisitedPlayer } from '../lib/localStorage';

export default function VisitPlayer(visitedPlayer: {
  playerId: number;
  playerName: string;
}) {
  useEffect(() => {
    addVisitedPlayer(visitedPlayer);
  }, [visitedPlayer]);
  return undefined;
}
