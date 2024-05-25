import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page() {
  const ratePage = await prisma.smashmateCurrentRatePage.findFirst();
  return (
    <div>{JSON.stringify({ ...ratePage, id: ratePage?.id.toString() })}</div>
  );
}
