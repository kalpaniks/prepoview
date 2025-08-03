import { getDecryptedTokensForUser } from '@/lib/adapter';
import { getFile } from '@/lib/github';
import prisma from '@/lib/prisma';
import { getShareDetails } from '@/lib/share';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const filePath = req.nextUrl.searchParams.get('filePath');
  if (!shareId || !filePath) {
    return NextResponse.json({ error: 'Share ID and file path are required' }, { status: 400 });
  }
  const shareDetails = await getShareDetails(shareId);
  const tokens = await getDecryptedTokensForUser(prisma, shareDetails.userId, 'github');
  if (!tokens?.access_token) {
    return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
  }
  const file = await getFile(
    shareDetails.repoName,
    shareDetails.repoOwner,
    tokens.access_token,
    filePath
  );
  return NextResponse.json(file);
}
