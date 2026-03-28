import { supabase } from "@/app/_lib/supabase";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } }
) {
  const { data } = await supabase
    .from('smashmateAccountInfo')
    .select('playerId, playerName')
    .eq('playerId', Number(params.playerId))
    .single();

  if (!data) {
    return Response.json(null);
  }
  return Response.json(data);
}
