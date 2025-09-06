import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getUserShares(userId: string) {
  try {
    const shares = await prisma.share.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        repoOwner: true,
        repoName: true,
        viewLimit: true,
        viewCount: true,
        sharedWith: true,
        expiresAt: true,
        createdAt: true,
        isExpired: true,
        isActive: true,
      },
    });
    return shares;
  } catch (error) {
    console.error('Error fetching user shares:', error);
    throw new Error('Failed to fetch user shares');
  }
}

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const shares = await getUserShares(session?.user?.id);
  return NextResponse.json(shares);
}
