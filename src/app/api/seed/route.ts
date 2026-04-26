import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if we already seeded
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json({ message: 'Already seeded' });
    }

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        name: 'Demo Admin',
        email: 'admin@campusconnect.com',
        role: 'ADMIN',
      },
    });

    // Create Ambassador
    const ambassador = await prisma.user.create({
      data: {
        name: 'John Ambassador',
        email: 'john@student.edu',
        role: 'AMBASSADOR',
        points: 120,
        level: 2,
        streak: 5,
      },
    });

    // Create Tasks
    await prisma.task.createMany({
      data: [
        {
          title: 'Post about Hackathon on LinkedIn',
          description: 'Share our latest hackathon post on LinkedIn and submit the link.',
          points: 50,
          type: 'PROMOTION',
        },
        {
          title: 'Refer 3 Friends',
          description: 'Get 3 friends to sign up for CampusConnect.',
          points: 100,
          type: 'REFERRAL',
        },
      ],
    });

    return NextResponse.json({ message: 'Seeded successfully', admin, ambassador });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
