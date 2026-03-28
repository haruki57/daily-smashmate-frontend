import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data } = await supabase
    .from('smashmateSeasons')
    .select('season, started_at, ended_at')
    .order('started_at', { ascending: true });

  const now = new Date();
  const filtered = (data ?? []).filter((season) => {
    if (season.ended_at != null) {
      return true;
    }
    const date = new Date(season.started_at);
    // we don't show latest season for first 3 days because data is not ready to show.
    return date.getTime() + 1000 * 60 * 60 * 24 * 3 < now.getTime();
  });

  return Response.json(filtered);
}
