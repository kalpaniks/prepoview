import prisma from '@/lib/prisma';
import { ViewerSession } from '@prisma/client';

export async function getShareDetails(shareID: string) {
  const share = await prisma.share.findUnique({
    where: { id: shareID },
    select: {
      id: true,
      repoName: true,
      repoOwner: true,
      userId: true,
      createdAt: true,
    },
  });
  if (!share) {
    throw new Error('Share Details not found');
  }
  return share;
}

export async function createViewSession(shareId: string, ttlMin = 30): Promise<ViewerSession> {
  const share = await prisma.share.findUnique({ where: { id: shareId } });
  const now = new Date();
  if (!share) {
    throw new Error('Share not found');
  }
  if (share.isExpired || !share.isActive || (share.expiresAt && share.expiresAt <= now)) {
    throw new Error('Share is expired');
  }
  if (share.maxShares && share.totalShares >= share.maxShares) {
    throw new Error('Share has reached the maximum number of views');
  }
  const session = await prisma.$transaction(async (tx) => {
    await tx.share.update({
      where: { id: shareId },
      data: { totalShares: { increment: 1 } },
    });
    return await tx.viewerSession.create({
      data: {
        shareId,
        expiresAt: new Date(now.getTime() + ttlMin * 60 * 1000),
      }
    });
  });
  return session;
}

export async function requireValidViewSession(shareId: string, sessionId?: string) {
  const now = new Date();

  const share = await prisma.share.findUnique({ where: { id: shareId } });
  if (!share) {
    throw new Error('Share not found');
  }
  if (share.isExpired || !share.isActive || (share.expiresAt && share.expiresAt <= now)) {
    throw new Error('Share is expired');
  }
  if (share.maxShares && share.totalShares >= share.maxShares) {
    throw new Error('Share has reached the maximum number of views');
  }
  if (!sessionId) {
    throw new Error('No session ID found');
  }
  const session = await prisma.viewerSession.findUnique({ where: { id: sessionId } });
  if (!session || session.shareId !== shareId) {
    throw new Error('Invalid session ID');
  }
  if (session.expiresAt && session.expiresAt <= now) {
    throw new Error('Session has expired');
  }
  return { valid: true };
}
