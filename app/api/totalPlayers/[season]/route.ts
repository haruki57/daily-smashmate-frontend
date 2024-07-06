import prisma from "@/app/_lib/prisma";

export async function GET(
  request: Request, 
  { params }: { params: { season: string } }
) {
  const ret = (await prisma.$queryRaw`select count::int 
    from "mv_smashmateCurrentPlayerRates_countBySeason"
    where "season" = ${params.season}`) as { count: number }[];
  return Response.json({totalPlayers: ret.at(0)?.count});
}