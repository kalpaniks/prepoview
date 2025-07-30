import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";


/*
type Share{
    id String @id @default(cuid())
    userId  String
    repoOwner String
    repoName String
    createdAt DateTime @default(now())
    user User   @relation(fields: [userId], references: [id])
}
*/

async function createShare(repoName : string, repoOwner : string, userId : string) : Promise<string> {
    const shareId = await prisma.share.create({
        data : {
            repoName : repoName,
            repoOwner : repoOwner,
            createdAt : new Date(),
            user : {
                connect : {
                    id : userId
                }
            }
        }
    });
    return shareId.id;
}

export async function POST(request: NextRequest): Promise<NextResponse> {

  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { repoName, repoOwner } = await request.json();
  const shareId = await createShare(repoName, repoOwner, session.user.id);

  return NextResponse.json({ shareId }, { status: 201 });
}
