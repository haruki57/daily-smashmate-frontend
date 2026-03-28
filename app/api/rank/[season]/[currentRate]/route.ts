import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { season: string; currentRate: string } }
) {
  const currentRateNum = Number(params.currentRate);

  const { data } = await supabase
    .from('smashmateRateCumulativeCounts')
    .select('cumulativeCount')
    .eq('season', params.season)
    .gt('rate', currentRateNum)
    .order('rate', { ascending: true })
    .limit(1)
    .single();

  if (data) {
    return Response.json({ rank: data.cumulativeCount + 1 });
  } else {
    return Response.json({ rank: 1 });
  }
}
