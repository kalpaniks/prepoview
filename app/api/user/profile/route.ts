import { getDecryptedTokensForUser } from '@/lib/adapter';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userTokens = await getDecryptedTokensForUser(prisma, session.user.id, 'github');
  if (!userTokens?.access_token) {
    return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
  }
  const response = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${userTokens.access_token}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
