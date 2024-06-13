import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export const runtime = 'edge';

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string } }
) {
  const ret = await getSmashmateAccount(Number(params.playerId));
  if (!ret) {
    return Response.json(null)
  }
  return Response.json({ ...ret })
}

const getSmashmateAccount = async (playerId: number) => {
  return await prisma.smashmateAccountInfo.findFirst({
    where: { playerId },
    select: {
      playerName: true,
      playerId: true,
    }
  });
}