import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getUserShares(userId: string) {
  try {
    const shares = await prisma.share.findMany({
      where: {
        userId: userId,
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
