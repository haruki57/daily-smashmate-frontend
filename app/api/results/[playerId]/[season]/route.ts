import { NextRequest } from 'next/server';
import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string; season: string } }
) {
  const seasonForRates = request.nextUrl.searchParams.get("prevSeason") ?? params.season;
  const { season, playerId: playerIdStr } = params;
  const playerId = Number(playerIdStr);

  // UNION を2クエリに分割
  const [{ data: wins }, { data: losses }] = await Promise.all([
    supabase
      .from('smashmateMatchRoomResults')
      .select('matchRoomId, winnerId, loserId, date')
      .eq('winnerId', playerId)
      .eq('season', season),
    supabase
      .from('smashmateMatchRoomResults')
      .select('matchRoomId, winnerId, loserId, date')
      .eq('loserId', playerId)
      .eq('season', season),
  ]);

  const allResults = [...(wins ?? []), ...(losses ?? [])];
  if (allResults.length === 0) {
    return Response.json([]);
  }

  // 対戦相手 ID を収集 (wins: 相手=loserId, losses: 相手=winnerId)
  const opponentIds = allResults.map((r) =>
    r.winnerId === playerId ? r.loserId : r.winnerId
  );
  const uniqueOpponentIds = Array.from(new Set(opponentIds));

  // 対戦相手の名前とレートをまとめて取得
  const [{ data: accounts }, { data: playerData }] = await Promise.all([
    supabase
      .from('smashmateAccountInfo')
      .select('playerId, playerName')
      .in('playerId', uniqueOpponentIds),
    supabase
      .from('smashmatePlayerDataBySeason')
      .select('playerId, currentRate, currentCharactersCsv')
      .eq('season', seasonForRates)
      .in('playerId', uniqueOpponentIds),
  ]);

  const accountMap: Record<number, string | null> = {};
  (accounts ?? []).forEach((a) => { accountMap[a.playerId] = a.playerName; });

  const playerDataMap: Record<number, { currentRate: number | null; currentCharactersCsv: string | null }> = {};
  (playerData ?? []).forEach((p) => {
    playerDataMap[p.playerId] = {
      currentRate: p.currentRate,
      currentCharactersCsv: p.currentCharactersCsv,
    };
  });

  const response = allResults.map((r) => {
    const opponentId = r.winnerId === playerId ? r.loserId : r.winnerId;
    return {
      matchRoomId: r.matchRoomId,
      winnerId: r.winnerId,
      loserId: r.loserId,
      date: r.date,
      playerId,
      opponentRate: playerDataMap[opponentId]?.currentRate ?? null,
      currentCharactersCsv: playerDataMap[opponentId]?.currentCharactersCsv ?? null,
      playerName: accountMap[opponentId] ?? null,
    };
  });

  return Response.json(response);
}
