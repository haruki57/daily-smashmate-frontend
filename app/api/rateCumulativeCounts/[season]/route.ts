import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string } }
) {
  const { data } = await supabase
    .from('smashmateRateCumulativeCounts')
    .select('rate, cumulativeCount')
    .eq('season', params.season)
    .order('rate', { ascending: false });

  return Response.json(data ?? []);
}
