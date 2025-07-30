import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function getShareDetails(
  shareId: string
): Promise<{ repoName: string; repoOwner: string } | null> {
  const share = await prisma.share.findUnique({
    where: {
      id: shareId,
    },
  });
  if (!share) {
    return null;
  }
  return { repoName: share.repoName, repoOwner: share.repoOwner };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
): Promise<NextResponse> {
  const { shareId } = params;
  const shareDetails = await getShareDetails(shareId);
  if (!shareDetails) {
    return NextResponse.json({ error: 'Share not found' }, { status: 404 });
  }
  return NextResponse.json(
    { repoName: shareDetails.repoName, repoOwner: shareDetails.repoOwner },
    { status: 200 }
  );
}
