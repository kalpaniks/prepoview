import { createViewSession } from '@/lib/share';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
): Promise<NextResponse> {
  const { shareId } = await params;
  try {
    const session = await createViewSession(shareId, 30);
    const response = NextResponse.json({ success: true, sessionExpiresAt: session.expiresAt });
    response.cookies.set('viewer_session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: `/api/share/${shareId}`,
      maxAge: 30 * 60,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    const res = NextResponse.json(
      { success: false, error: 'Failed to create view session' },
      { status: 500 }
    );
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}
