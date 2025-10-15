import { NextRequest, NextResponse } from 'next/server';
import { getCommitHistory } from '@/lib/github';
import { getShareDetails } from '@/lib/share';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '30', 10);

    // Verify share access
    const sessionId = request.cookies.get('viewer_session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.viewerSession.findUnique({
      where: { sessionId, shareId },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Get share details
    const shareData = await getShareDetails(shareId);
    
    // Decrypt the access token
    const decryptedToken = decrypt(shareData.encryptedToken);

    // Fetch commit history
    const commits = await getCommitHistory(
      shareData.repoName,
      shareData.repoOwner,
      decryptedToken,
      page,
      perPage
    );

    return NextResponse.json(commits);
  } catch (error) {
    console.error('Error fetching commits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commits' },
      { status: 500 }
    );
  }
}
