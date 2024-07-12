import prisma from "@/app/_lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request, 
) {
  const ret = await prisma.smashmateSeasons.findMany({
    orderBy: { started_at: "asc" }
  });
  return Response.json(ret);
}