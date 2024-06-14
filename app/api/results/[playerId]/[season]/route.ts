import { PrismaClient } from '@prisma/client/edge';
import { NextRequest } from 'next/server';
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest, 
  { params }: { params: { playerId: string; season: string } }
) {
  const seasonForRates = request.nextUrl.searchParams.get("prevSeason") ?? params.season;
  const { season, playerId: playerIdStr } = params;
  const playerId = Number(playerIdStr);
  const ret = await prisma.$queryRaw`select 
    "smashmateMatchRoomResults"."matchRoomId", "smashmateMatchRoomResults"."winnerId",  "smashmateMatchRoomResults"."loserId", "smashmateCurrentPlayerRates"."currentRate" 
    from "smashmateMatchRoomResults" 
    left join "smashmateCurrentPlayerRates" on "smashmateMatchRoomResults"."loserId" = "smashmateCurrentPlayerRates"."playerId" and "smashmateCurrentPlayerRates"."season" = ${seasonForRates}
    where "winnerId" = ${playerId} and "smashmateMatchRoomResults"."season" = ${season}
    union 
    select "smashmateMatchRoomResults"."matchRoomId", "smashmateMatchRoomResults"."winnerId",  "smashmateMatchRoomResults"."loserId", "smashmateCurrentPlayerRates"."currentRate" from "smashmateMatchRoomResults" 
    left join "smashmateCurrentPlayerRates" on "smashmateMatchRoomResults"."winnerId" = "smashmateCurrentPlayerRates"."playerId" and "smashmateCurrentPlayerRates"."season" = ${seasonForRates}
    where "loserId" = ${playerId} and "smashmateMatchRoomResults"."season" = ${season};` as any
  return Response.json(ret.map((r: any) => {
    return {
      ...r,
      playerId,
      opponentRate: r.currentRate,
      currentRate: undefined
    }
  }));
}