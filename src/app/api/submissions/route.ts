import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const submissions = await prisma.submission.findMany({
    include: {
      user: true,
      task: true,
    },
    orderBy: { submittedAt: 'desc' }
  });
  return NextResponse.json(submissions);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Find ambassador user
    const ambassador = await prisma.user.findFirst({ where: { role: 'AMBASSADOR' } });
    if (!ambassador) return NextResponse.json({ error: 'No ambassador found' }, { status: 400 });

    const submission = await prisma.submission.create({
      data: {
        proofUrl: data.proofUrl,
        userId: ambassador.id,
        taskId: data.taskId,
      }
    });
    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
