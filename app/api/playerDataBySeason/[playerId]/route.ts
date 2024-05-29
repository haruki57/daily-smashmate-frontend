import { PlayerDataBySeason } from '@/app/_lib/services/type';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string } }
) {
  const ret = await getPlayerDataBySeason(Number(params.playerId));
  return Response.json(
    ret.reduce((prev, current) => {
      prev[current.season] = current;
      return prev;
    }, {} as { [key in string]: PlayerDataBySeason })
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
    }
  });
}