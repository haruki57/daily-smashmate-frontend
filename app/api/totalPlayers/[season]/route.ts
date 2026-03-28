import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string } }
) {
  const { data } = await supabase
    .from('mv_smashmateCurrentPlayerRates_countBySeason')
    .select('count')
    .eq('season', params.season)
    .single();

  return Response.json({ totalPlayers: data?.count ?? null });
}
