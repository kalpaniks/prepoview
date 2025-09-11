import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.account.updateMany({
        where: { userId: session.user.id, provider: 'github' },
        data: {
          access_token: null,
          refresh_token: null,
          id_token: null,
          expires_at: null,
          scope: null,
          token_type: null,
        },
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          githubId: null,
          revokedAt: new Date(),
        },
      });

      await tx.share.deleteMany({
        where: { userId: session.user.id },
      });
    });

    const res = NextResponse.json({ success: true });

    const cookieNames = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
    ];
    const past = new Date(0).toUTCString();
    for (const name of cookieNames) {
      res.headers.append(
        'Set-Cookie',
        `${name}=; Path=/; Expires=${past}; Max-Age=0; HttpOnly; SameSite=Lax`
      );
    }

    return res;
  } catch (error) {
    console.error('Failed to revoke GitHub access:', error);
    return NextResponse.json({ error: 'Failed to revoke access' }, { status: 500 });
  }
}
