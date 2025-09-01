import { requireValidViewSession } from "@/lib/share";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;
  try {
    const response = await requireValidViewSession(shareId);
    return NextResponse.json( response );
  } catch (error) {
    return NextResponse.json(
      { hasAccess: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 403 });
  }
}
