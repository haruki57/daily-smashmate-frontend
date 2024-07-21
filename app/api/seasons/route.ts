import prisma from "@/app/_lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request, 
) {
  const ret = await prisma.smashmateSeasons.findMany({
    orderBy: { started_at: "asc" }
  });
  const now = new Date();
  return Response.json(ret.filter((season) => {
    if (season.ended_at != null) {
      return true;
    }
    const date = new Date(season.started_at);

    // we don't show latest season for first 3 days because data is not ready to show.
    return date.getTime() + 1000 * 60 * 60 * 24 * 3 < now.getTime();
  }));
}