import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface ShareRequest {
  userId: string;
  repoName: string;
  repoOwner: string;
  maxShares?: number;
  expiresAt?: Date;
  sharedWith?: string;
}

async function createShare(shareRequest: ShareRequest): Promise<string> {
  try {
  const share = await prisma.share.create({
    data: {
      repoName: shareRequest.repoName,
      repoOwner: shareRequest.repoOwner,
      maxShares: shareRequest.maxShares,
      expiresAt: shareRequest.expiresAt,
      sharedWith: shareRequest.sharedWith,
      createdAt: new Date(),
      user: {
        connect: {
          id: shareRequest.userId,
        },
      },
    },
  });
    return share.id;
  } catch (error) {
    console.error('Error creating share:', error);
    throw new Error('Failed to create share');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { repoName, repoOwner, maxShares, expiresAt, sharedWith } = await request.json();
  if (!repoName || !repoOwner) {
    return NextResponse.json({ error: 'Repo name and repo owner are required' }, { status: 400 });
  }
  const shareId = await createShare({
    userId: session.user.id,
    repoName,
    repoOwner,
    maxShares,
    expiresAt,
    sharedWith,
  });

  return NextResponse.json({ shareId }, { status: 201 });
}
