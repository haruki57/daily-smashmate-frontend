import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
) {
  const ret = await prisma.smashmateSeasons.findMany({
    orderBy: { started_at: "asc" }
  });
  return Response.json(ret);
}