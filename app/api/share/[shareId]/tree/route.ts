import { NextRequest, NextResponse } from "next/server";
import { getShareDetails } from "@/lib/share";
import { getTree } from "@/lib/github";
import { getDecryptedTokensForUser } from "@/lib/adapter";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  const shareID = req.nextUrl.pathname.split("/").pop();
  const branch = req.nextUrl.searchParams.get("branch");
  if (!shareID) {
    return NextResponse.json({ error: "Share ID is required" }, { status: 400 });
  }
  const defaultBranch = branch ?? "main";
  const share = await getShareDetails(shareID);
  const accessToken = await getDecryptedTokensForUser(prisma, share.userId, 'github');
  if (!accessToken?.access_token) {
    return NextResponse.json({ error: "Access token not found" }, { status: 400 });
  }
  const tree = await getTree(share.repoName, share.repoOwner, accessToken.access_token, defaultBranch);
  return NextResponse.json(tree);
}
