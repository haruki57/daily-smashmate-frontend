import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { season: string, currentRate: string } }
) {
  const currentRateNum = Number(params.currentRate);
  const ret = await prisma.smashmateRateCumulativeCounts.findFirst({
    where: { season: params.season, rate: {gt: currentRateNum} },
    select: {
      cumulativeCount: true,
    },
    orderBy: { rate: 'asc' },
    take: 1,    
  });
  
  if (ret) {
    return Response.json({rank: ret.cumulativeCount+1});
  } else {
    return Response.json({rank: 1});
  }
}