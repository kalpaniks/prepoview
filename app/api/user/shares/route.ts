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

export async function DELETE(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    await prisma.share.deleteMany({ where: { userId: userId } });
    return NextResponse.json({ message: 'All shares deleted' });
  } catch (error) {
    console.error('Error deleting shares:', error);
    return NextResponse.json({ error: 'Failed to delete shares' }, { status: 500 });
  }
}
