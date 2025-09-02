import { requireValidViewSession } from '@/lib/share';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const sessionId = req.cookies.get('viewer_session')?.value;
  try {
    const response = await requireValidViewSession(shareId, sessionId);
    const res = NextResponse.json(response);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (error) {
    const res = NextResponse.json(
      { hasAccess: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 403 }
    );
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}
