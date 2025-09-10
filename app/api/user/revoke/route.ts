import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.account.deleteMany({ where: { userId: session.user.id, provider: 'github' } });
    await prisma.share.deleteMany({ where: { userId: session.user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to revoke GitHub access:', error);
    return NextResponse.json({ error: 'Failed to revoke access' }, { status: 500 });
  }
}
