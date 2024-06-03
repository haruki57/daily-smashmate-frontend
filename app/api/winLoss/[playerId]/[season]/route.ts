import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string; season: string } }
) {
  const ret = await prisma.smashmateMatchRoomResults.findMany({
    where: { season: params.season, OR: [{winnerId: Number(params.playerId)},{loserId: Number(params.playerId)}, ] },
    select: {
      matchRoomId: true,
      winnerId: true,
      loserId: true,
      season: true,
    },
    orderBy: { matchRoomId: 'asc' },
    
  });
  return Response.json(ret);
}