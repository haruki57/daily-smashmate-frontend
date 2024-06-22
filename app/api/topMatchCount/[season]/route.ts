import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export const runtime = 'edge';

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await fetchDB(params.season);
  return Response.json(ret);
}

const fetchDB = async (season: string) => {
  const ret = await prisma.$queryRaw`
    select * from 
    "mv_smashmatePlayerDataBySeason_matchCountTop100"
    where season = ${season} order by "matchCount" desc;`
  return ret as any;
}