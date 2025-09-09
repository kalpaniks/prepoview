import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Share } from '@prisma/client';

interface CreateShareRequest {
  userId: string;
  repoName: string;
  repoOwner: string;
  viewLimit?: number;
  expiresAt?: Date;
  sharedWith?: string;
}

async function createShare(shareRequest: CreateShareRequest): Promise<string> {
  try {
    const share = await prisma.share.create({
      data: {
        repoName: shareRequest.repoName,
        repoOwner: shareRequest.repoOwner,
        viewLimit: shareRequest.viewLimit,
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

async function updateShare(id: string, updates: Partial<Share>): Promise<Share> {
  const share = await prisma.share.update({ where: { id }, data: updates });
  return share;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { repoName, repoOwner, viewLimit, expiresAt, sharedWith } = await request.json();
  if (!repoName || !repoOwner) {
    return NextResponse.json({ error: 'Repo name and repo owner are required' }, { status: 400 });
  }
  const shareId = await createShare({
    userId: session.user.id,
    repoName,
    repoOwner,
    viewLimit,
    expiresAt,
    sharedWith,
  });

  return NextResponse.json({ shareId }, { status: 201 });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, expiresAt, viewLimit } = await request.json();
  const share = await updateShare(id, { expiresAt, viewLimit });
  return NextResponse.json(share);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await request.json();
  await prisma.share.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ message: 'Share deleted' });
}
