import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { playerId: string; season: string } }
) {
  const { data: rankData } = await supabase
    .from('smashmateRankByCharacter')
    .select('characterId, rank')
    .eq('season', params.season)
    .eq('playerId', Number(params.playerId));

  if (!rankData || rankData.length === 0) {
    return Response.json([]);
  }

  const characterIds = rankData.map((row) => row.characterId);

  // groupBy の代わりにまとめて取得してコードでカウント
  const { data: allRows } = await supabase
    .from('smashmateRankByCharacter')
    .select('characterId')
    .eq('season', params.season)
    .in('characterId', characterIds);

  const countMap: Record<string, number> = {};
  (allRows ?? []).forEach((row) => {
    countMap[row.characterId] = (countMap[row.characterId] ?? 0) + 1;
  });

  return Response.json(
    rankData.map((row) => ({
      ...row,
      totalPlayerCount: countMap[row.characterId] ?? 0,
    }))
  );
}
