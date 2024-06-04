import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await prisma.smashmateCurrentPlayerRates.count({where: {season: params.season}});
  return Response.json({totalPlayers: ret});
}