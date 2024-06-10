'use client';

import { addVisitedPlayer } from '../lib/localStorage';

export default function VisitPlayer(visitedPlayer: {
  playerId: number;
  playerName: string;
}) {
  addVisitedPlayer(visitedPlayer);
  return undefined;
}
