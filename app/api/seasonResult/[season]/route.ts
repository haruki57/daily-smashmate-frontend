import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await prisma.smashmateSeasonResults.findUnique({
    where: { season: params.season },
  });
  return Response.json(ret);
}