import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await prisma.smashmateRateCumulativeCounts.findMany({
    where: { season: params.season },
    select: {
      rate: true,
      cumulativeCount: true,
    },
    orderBy: { rate: 'desc'},
  });
  return Response.json(ret);
}