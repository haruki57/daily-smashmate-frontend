import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { playerId: string } }
) {
  // const { searchParams } = new URL(request.url)
  // const id = searchParams.get('id')
  // const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY!,
  //   },
  // })
  const ret = await getSmashmateAccount(Number(params.playerId));
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