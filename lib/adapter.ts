import { PrismaAdapter } from '@auth/prisma-adapter';
import { encrypt, decrypt } from '@/lib/crypto';
import type { PrismaClient } from '@prisma/client';
import { AdapterAccount } from 'next-auth/adapters';

/**
 * @param prisma - PrismaClient instance
 * @returns Adapter with encrypted token storage
 */
export function EncryptedPrismaAdapter(prisma: PrismaClient) {
  const base = PrismaAdapter(prisma);

  return {
    ...base,

    async linkAccount(account: AdapterAccount) {
      const accountToStore = {
        ...account,
        token_type: account.token_type as Lowercase<string> | undefined,
      };

      if (accountToStore.access_token) {
        accountToStore.access_token = encrypt(accountToStore.access_token);
      }

      if (accountToStore.refresh_token) {
        accountToStore.refresh_token = encrypt(accountToStore.refresh_token);
      }

      return base.linkAccount!(accountToStore);
    },
  };
}

/**
 * @param prisma - PrismaClient instance
 * @param provider - OAuth provider name (e.g., "github")
 * @param providerAccountId - Provider's account ID
 * @returns Decrypted account with tokens or null if not found
 *
 * @example
 * ```typescript
 * const account = await getDecryptedAccount(prisma, "github", "123456");
 * if (account?.access_token) {
 *   // Use the decrypted access token for GitHub API calls
 *   const response = await fetch("https://api.github.com/user", {
 *     headers: { Authorization: `Bearer ${account.access_token}` }
 *   });
 * }
 * ```
 */
export async function getDecryptedAccount(
  prisma: PrismaClient,
  provider: string,
  providerAccountId: string
) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
  });

  if (!account) return null;

  const decryptedAccount = { ...account };
  if (decryptedAccount.access_token) {
    try {
      decryptedAccount.access_token = decrypt(decryptedAccount.access_token);
    } catch (error) {
      console.error('Failed to decrypt access_token:', error);
      decryptedAccount.access_token = null;
    }
  }

  if (decryptedAccount.refresh_token) {
    try {
      decryptedAccount.refresh_token = decrypt(decryptedAccount.refresh_token);
    } catch (error) {
      console.error('Failed to decrypt refresh_token:', error);
      decryptedAccount.refresh_token = null;
    }
  }

  return decryptedAccount;
}

/**
 * @param prisma - PrismaClient instance
 * @param userId - User's ID from the session
 * @param provider - OAuth provider name (e.g., "github")
 * @returns Object with decrypted tokens or null if not found
 *
 * @example
 * ```typescript
 * const session = await getServerSession(authOptions);
 * if (session?.user?.id) {
 *   const tokens = await getDecryptedTokensForUser(prisma, session.user.id, "github");
 *   if (tokens?.access_token) {
 *     // Make authenticated GitHub API request with decrypted tokens
 *   }
 * }
 * ```
 */
export async function getDecryptedTokensForUser(
  prisma: PrismaClient,
  userId: string,
  provider: string
): Promise<{ access_token?: string; refresh_token?: string } | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider,
    },
  });

  if (!account) return null;

  const tokens: { access_token?: string; refresh_token?: string } = {};

  if (account.access_token) {
    try {
      tokens.access_token = decrypt(account.access_token);
    } catch (error) {
      console.error('Failed to decrypt access_token:', error);
    }
  }

  if (account.refresh_token) {
    try {
      tokens.refresh_token = decrypt(account.refresh_token);
    } catch (error) {
      console.error('Failed to decrypt refresh_token:', error);
    }
  }

  return tokens;
}
