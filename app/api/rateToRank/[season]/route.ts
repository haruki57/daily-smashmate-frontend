import prisma from "@/app/_lib/prisma";

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = await prisma.smashmateRateToRank.findMany({
    select: {
      season: true,
      rate: true,
      rank: true,
    },
    where: { season: params.season },
    orderBy: {rank: 'asc'}
  })
  return Response.json(ret.map((r) => { return { ...r, id: undefined } }));
}