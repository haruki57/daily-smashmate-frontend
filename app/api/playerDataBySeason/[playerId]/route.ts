import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export const runtime = 'edge';

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string } }
) {
  const ret = await getPlayerDataBySeason(Number(params.playerId));
  return Response.json(
    ret.reduce((prev, current) => { 
      if ((current as any).lastPlayerPageVisitedAt.getFullYear() === 1000) {
        prev[current.season] = { ...current, lastPlayerPageVisitedAt: undefined} as any;
      } else {
        prev[current.season] = current;
      }
      return prev;
    }, {} as { [key in string]: Omit<PlayerDataBySeason, "lastPlayerPageVisitedAt"> })
  );
}

const getPlayerDataBySeason = async (playerId: number): Promise<Omit<PlayerDataBySeason, "lastPlayerPageVisitedAt">[]> => {
  const ret = await prisma.$queryRaw`select 
    "smashmatePlayerDataBySeason"."season", 
    "smashmatePlayerDataBySeason"."playerId", 
    "smashmatePlayerDataBySeason"."currentRate", 
    "smashmatePlayerDataBySeason"."maxRate", 
    "smashmatePlayerDataBySeason"."win", 
    "smashmatePlayerDataBySeason"."loss", 
    "smashmatePlayerDataBySeason"."currentCharactersCsv", 
    "smashmatePlayerDataBySeason"."lastPlayerPageVisitedAt", 
    "smashmatePlayerDataBySeason"."loss", 
    "smashmateRateToRank"."rank",
    "smashmateCurrentTop200"."rank" as "rankFromTop200",
    "mv_smashmateCurrentPlayerRates_countBySeason"."count"::int as "totalPlayerCount"
    from "smashmatePlayerDataBySeason" 
    left join "smashmateRateToRank" on "currentRate" = "rate" and 
    "smashmatePlayerDataBySeason"."season" = "smashmateRateToRank"."season" 
    left join "smashmateCurrentTop200" on 
    "smashmatePlayerDataBySeason"."playerId" = "smashmateCurrentTop200"."playerId"
    left join "mv_smashmateCurrentPlayerRates_countBySeason" on 
      "mv_smashmateCurrentPlayerRates_countBySeason"."season" = "smashmatePlayerDataBySeason"."season"
    where "smashmatePlayerDataBySeason"."playerId" = ${playerId};`
  return ret as any;
}