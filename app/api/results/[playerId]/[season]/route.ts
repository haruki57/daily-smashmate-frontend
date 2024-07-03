import { PrismaClient } from '@prisma/client';
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
    "smashmateMatchRoomResults"."matchRoomId", 
    "smashmateMatchRoomResults"."winnerId",  
    "smashmateMatchRoomResults"."loserId", 
    "smashmateMatchRoomResults"."date", 
    "smashmateAccountInfo"."playerName",
    "smashmatePlayerDataBySeason"."currentRate",
    "smashmatePlayerDataBySeason"."currentCharactersCsv"
    from "smashmateMatchRoomResults" 
    left join "smashmatePlayerDataBySeason" on "smashmateMatchRoomResults"."loserId" = "smashmatePlayerDataBySeason"."playerId" and "smashmatePlayerDataBySeason"."season" = ${seasonForRates}
    left join "smashmateAccountInfo" on "smashmateMatchRoomResults"."loserId" = "smashmateAccountInfo"."playerId"
    where "winnerId" = ${playerId} and "smashmateMatchRoomResults"."season" = ${season}
    union 
    select 
    "smashmateMatchRoomResults"."matchRoomId", 
    "smashmateMatchRoomResults"."winnerId",
    "smashmateMatchRoomResults"."loserId", 
    "smashmateMatchRoomResults"."date", 
    "smashmateAccountInfo"."playerName",
    "smashmatePlayerDataBySeason"."currentRate",
    "smashmatePlayerDataBySeason"."currentCharactersCsv"
    from "smashmateMatchRoomResults" 
    left join "smashmatePlayerDataBySeason" on "smashmateMatchRoomResults"."winnerId" = "smashmatePlayerDataBySeason"."playerId" and "smashmatePlayerDataBySeason"."season" = ${seasonForRates}
        left join "smashmateAccountInfo" on "smashmateMatchRoomResults"."winnerId" = "smashmateAccountInfo"."playerId"
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