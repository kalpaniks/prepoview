import prisma from '@/lib/prisma';

export async function getShareDetails(shareID: string) {
  const share = await prisma.share.findUnique({
    where: { id: shareID },
    select: {
      repoName: true,
      repoOwner: true,
      userId: true,
    },
  });
  if (!share) {
    throw new Error('Share Details not found');
  }
  return share;
}
