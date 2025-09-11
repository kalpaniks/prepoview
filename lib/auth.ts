import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import prisma from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getValidatedSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  try {
    // Ensure user exists
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    // If user is missing but we have an access token, recreate minimal user and account
    if (!user && session.accessToken) {
      const ghResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (!ghResponse.ok) {
        return null;
      }
      const gh = await ghResponse.json();
      const githubId = String(gh.id);

      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: session.user.id,
            name: typeof gh.name === 'string' ? gh.name : null,
            image: typeof gh.avatar_url === 'string' ? gh.avatar_url : null,
            githubId,
          },
        });
        await tx.account.create({
          data: {
            userId: session.user.id,
            type: 'oauth',
            provider: 'github',
            providerAccountId: githubId,
            access_token: encrypt(session.accessToken as string),
            token_type: 'bearer',
          },
        });
      });

      user = { id: session.user.id };
    }

    // If user exists but account missing, rebuild account from session token
    if (user) {
      const account = await prisma.account.findFirst({
        where: { userId: session.user.id, provider: 'github' },
      });
      if (!account && session.accessToken) {
        const ghResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        if (!ghResponse.ok) {
          return null;
        }
        const gh = await ghResponse.json();
        const githubId = String(gh.id);
        await prisma.account.create({
          data: {
            userId: session.user.id,
            type: 'oauth',
            provider: 'github',
            providerAccountId: githubId,
            access_token: encrypt(session.accessToken as string),
            token_type: 'bearer',
          },
        });
      }
    }

    return session;
  } catch (error) {
    console.error('Validated session failed:', error);
    return null;
  }
}
