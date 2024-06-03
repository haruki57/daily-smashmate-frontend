import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await prisma.smashmateCurrentPlayerRates.findMany({
    where: { season: params.season },
    select: {
      currentRate: true,
      playerId: true,
    },
  });
  return Response.json(ret);
}