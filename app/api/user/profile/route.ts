import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const accessToken = session.accessToken;
  const response = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
