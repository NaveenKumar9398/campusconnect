import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        points: parseInt(data.points),
        type: data.type || 'CONTENT',
      }
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
