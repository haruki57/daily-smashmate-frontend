import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
) {
  const ret = await prisma.smashmateCurrentTop200.findMany({
    orderBy: {rank: 'asc'}
  })
  
  return Response.json(ret.map((r) => { return { ...r, id: undefined } }));
}