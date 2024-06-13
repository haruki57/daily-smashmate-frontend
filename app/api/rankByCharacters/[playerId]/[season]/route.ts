import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string; season: string } }
) {
  const ret = await prisma.smashmateRankByCharacter.findMany({
    where: { season: params.season,  playerId: Number(params.playerId)},
    select: {
      characterId: true,
      rank: true,
    },
  });
  const ret2 = await prisma.smashmateRankByCharacter.groupBy({
    by: "characterId", 
    _count: true,
    where: {
      season: params.season,
      characterId: {
        in: ret.map((row) => row.characterId)
      }
    },
  });
  return Response.json(ret.map((row) => {
    const totalPlayerCount = ret2.find((r) => r.characterId === row.characterId)?._count;
    return {
      ...row, totalPlayerCount,
    }
  }));
}