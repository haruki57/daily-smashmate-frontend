import { getCurrentTime } from '@/app/_lib/services/getCurrentTime';
import { PrismaClient } from '@prisma/client/edge';
const prisma = new PrismaClient();

export default async function Page() {
  const hoge = await getCurrentTime();
  return <div>{hoge.timestamp}</div>;
}
