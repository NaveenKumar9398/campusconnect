import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await req.json();
    const id = (await params).id;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { task: true, user: true }
    });

    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.submission.update({
      where: { id },
      data: { status }
    });

    if (status === 'APPROVED' && submission.status !== 'APPROVED') {
      const newPoints = submission.user.points + submission.task.points;
      const newLevel = Math.floor(newPoints / 100) + 1; // 1 level per 100 points
      const newStreak = submission.user.streak + 1;

      await prisma.user.update({
        where: { id: submission.userId },
        data: {
          points: newPoints,
          level: newLevel,
          streak: newStreak
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
