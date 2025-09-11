import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import { EncryptedPrismaAdapter } from '@/lib/adapter';
import { Adapter } from 'next-auth/adapters';
import { getDecryptedTokensForUser } from '@/lib/adapter';
import { encrypt } from '@/lib/crypto';

export const authOptions: NextAuthOptions = {
  adapter: EncryptedPrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'repo user:email',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === 'github' && user.id) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { revokedAt: true },
          });

          if (existingUser?.revokedAt !== null && existingUser?.revokedAt !== undefined) {
            await prisma.$transaction(async (tx) => {
              await tx.account.updateMany({
                where: { userId: user.id, provider: 'github' },
                data: {
                  access_token: account.access_token ? encrypt(account.access_token) : null,
                  refresh_token: account.refresh_token ? encrypt(account.refresh_token) : null,
                  expires_at: account.expires_at,
                  scope: account.scope,
                  token_type: account.token_type,
                  id_token: account.id_token,
                },
              });

              await tx.user.update({
                where: { id: user.id },
                data: { revokedAt: null },
              });
            });
          }
        } catch (error) {
          console.error('Failed to handle re-authentication:', error);
        }
      }
      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        return token;
      }
      if (token.sub && !token.accessToken) {
        try {
          const tokens = await getDecryptedTokensForUser(prisma, token.sub, 'github');
          if (tokens?.access_token) {
            token.accessToken = tokens.access_token;
          }
        } catch (error) {
          console.error('Failed to fetch fresh tokens:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
