import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string } }
) {
  const { data: top200, error } = await supabase
    .from('smashmateCurrentTop200')
    .select('rank, playerId, rate, currentCharactersCsv')
    .eq('season', params.season)
    .order('rank', { ascending: true });

  if (error) {
    console.error('top200 error:', error);
    return Response.json([]);
  }
  if (!top200 || top200.length === 0) {
    return Response.json([]);
  }

  const playerIds = top200.map((r) => r.playerId);
  const { data: accounts } = await supabase
    .from('smashmateAccountInfo')
    .select('playerId, playerName')
    .in('playerId', playerIds);

  const accountMap: Record<number, string | null> = {};
  (accounts ?? []).forEach((a) => { accountMap[a.playerId] = a.playerName; });

  const result = top200.map((r) => ({
    rank: r.rank,
    playerId: r.playerId,
    rate: r.rate,
    currentCharactersCsv: r.currentCharactersCsv,
    accountInfo: { playerName: accountMap[r.playerId] ?? null },
  }));

  return Response.json(result);
}
