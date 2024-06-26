import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
) {
  const ret = await prisma.smashmateCurrentTop200.findMany({
    select: {
      rank: true,
      playerId: true,
      rate: true,
      currentCharactersCsv: true,
      accountInfo: {
        select: {
          playerName: true,
        },
      }
    },
    orderBy: { rank: 'asc' }
    
  })
  
  return Response.json(ret.map((r) => { return { ...r, id: undefined } }));
}