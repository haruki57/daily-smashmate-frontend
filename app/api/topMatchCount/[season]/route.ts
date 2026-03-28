import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string } }
) {
  const { data } = await supabase
    .from('mv_smashmatePlayerDataBySeason_matchCountTop100')
    .select('*')
    .eq('season', params.season)
    .order('matchCount', { ascending: false });

  return Response.json(data ?? []);
}
