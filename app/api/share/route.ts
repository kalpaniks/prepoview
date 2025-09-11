import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getValidatedSession } from '@/lib/auth';
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

async function updateShare(id: string, updates: Partial<Share>, userId: string): Promise<Share> {
  const existing = await prisma.share.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error('Share not found or not owned by user');
  }
  const share = await prisma.share.update({ where: { id, userId }, data: updates });
  return share;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getValidatedSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { repoName, repoOwner, viewLimit, expiresAt, sharedWith } = await request.json();
  if (!repoName || !repoOwner) {
    return NextResponse.json({ error: 'Repo name and repo owner are required' }, { status: 400 });
  }
  try {
    const shareId = await createShare({
      userId: session.user.id,
      repoName,
      repoOwner,
      viewLimit,
      expiresAt,
      sharedWith,
    });
    return NextResponse.json({ shareId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create share';
    const status = message.includes('User not found') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const session = await getValidatedSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, expiresAt, viewLimit } = await request.json();
  try {
    const share = await updateShare(id, { expiresAt, viewLimit }, session.user.id);
    return NextResponse.json(share);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update share' },
      { status: 403 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getValidatedSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const shareId = req.nextUrl.searchParams.get('shareId');
  if (!shareId) {
    return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
  }
  await prisma.share.delete({ where: { id: shareId, userId: session.user.id } });
  return NextResponse.json({ message: 'Share deleted' });
}
