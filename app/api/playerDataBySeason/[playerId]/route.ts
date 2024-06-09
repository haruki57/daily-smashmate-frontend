import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export const runtime = 'edge';

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string } }
) {
  const ret = await getPlayerDataBySeason(Number(params.playerId));
  return Response.json(
    ret.reduce((prev, current) => { 
      if (current.lastPlayerPageVisitedAt.getFullYear() === 1000) {
        prev[current.season] = { ...current, lastPlayerPageVisitedAt: undefined} as any;
      } else {
        prev[current.season] = current;
      }
      
      return prev;
    }, {} as { [key in string]: Omit<PlayerDataBySeason, "lastPlayerPageVisitedAt"> })
  );
}

const getPlayerDataBySeason = async (playerId: number) => {
  return await prisma.smashmatePlayerDataBySeason.findMany({
    where: { playerId },
    select: {
      season: true,
      playerId: true,
      currentRate: true,
      maxRate: true,
      win: true,
      loss: true,
      currentCharactersCsv: true,
      lastPlayerPageVisitedAt: true,
    }
  });
}