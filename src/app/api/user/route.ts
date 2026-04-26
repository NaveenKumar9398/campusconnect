import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type === 'leaderboard') {
    const users = await prisma.user.findMany({
      where: { role: 'AMBASSADOR' },
      orderBy: { points: 'desc' },
      take: 10
    });
    return NextResponse.json(users);
  }

  // Just return the first ambassador for demo purposes
  const ambassador = await prisma.user.findFirst({
    where: { role: 'AMBASSADOR' }
  });
  
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  return NextResponse.json({ ambassador, admin });
}
