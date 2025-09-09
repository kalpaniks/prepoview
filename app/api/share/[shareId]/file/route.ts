import { getDecryptedTokensForUser } from '@/lib/adapter';
import { getFile } from '@/lib/github';
import prisma from '@/lib/prisma';
import { getShareDetails, requireValidViewSession } from '@/lib/share';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const sessionId = req.cookies.get('viewer_session')?.value;
  try {
    await requireValidViewSession(shareId, sessionId);
  } catch {
    const response = NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    response.cookies.delete('viewer_session');
    return response;
  }
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
  const response = NextResponse.json(file);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
