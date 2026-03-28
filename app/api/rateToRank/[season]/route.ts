import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string } }
) {
  const { data } = await supabase
    .from('smashmateRateToRank')
    .select('season, rate, rank')
    .eq('season', params.season)
    .order('rank', { ascending: true });

  return Response.json(data ?? []);
}
