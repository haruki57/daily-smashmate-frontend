import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } }
) {
  const playerId = Number(params.playerId);

  const { data: playerData } = await supabase
    .from('smashmatePlayerDataBySeason')
    .select('season, playerId, currentRate, maxRate, win, loss, currentCharactersCsv, lastPlayerPageVisitedAt')
    .eq('playerId', playerId);

  if (!playerData || playerData.length === 0) {
    return Response.json({});
  }

  const seasons = Array.from(new Set(playerData.map((p) => p.season)));

  // 複数テーブルからまとめて取得
  const [{ data: rateToRanks }, { data: top200 }, { data: playerCounts }] = await Promise.all([
    supabase
      .from('smashmateRateToRank')
      .select('season, rate, rank')
      .in('season', seasons),
    supabase
      .from('smashmateCurrentTop200')
      .select('season, rank, playerId')
      .eq('playerId', playerId)
      .in('season', seasons),
    supabase
      .from('mv_smashmateCurrentPlayerRates_countBySeason')
      .select('season, count')
      .in('season', seasons),
  ]);

  // ルックアップマップを作成
  const rateToRankMap: Record<string, Record<number, number>> = {};
  (rateToRanks ?? []).forEach((r) => {
    if (!rateToRankMap[r.season]) rateToRankMap[r.season] = {};
    rateToRankMap[r.season][r.rate] = r.rank;
  });

  const top200Map: Record<string, number | null> = {};
  (top200 ?? []).forEach((t) => { top200Map[t.season] = t.rank; });

  const countMap: Record<string, number | null> = {};
  (playerCounts ?? []).forEach((c) => { countMap[c.season] = Number(c.count); });

  const result = playerData.reduce((prev, current) => {
    const lastVisited = current.lastPlayerPageVisitedAt;
    const isInvalidDate = lastVisited && new Date(lastVisited).getFullYear() === 1000;

    prev[current.season] = {
      season: current.season,
      playerId: current.playerId,
      currentRate: current.currentRate,
      maxRate: current.maxRate,
      win: current.win,
      loss: current.loss,
      currentCharactersCsv: current.currentCharactersCsv,
      lastPlayerPageVisitedAt: isInvalidDate ? undefined : lastVisited,
      rank: current.currentRate != null
        ? (rateToRankMap[current.season]?.[current.currentRate] ?? null)
        : null,
      rankFromTop200: top200Map[current.season] ?? null,
      totalPlayerCount: countMap[current.season] ?? null,
    };
    return prev;
  }, {} as Record<string, unknown>);

  return Response.json(result);
}
