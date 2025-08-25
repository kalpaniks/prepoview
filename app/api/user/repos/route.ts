import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/types/share";


async function getUserRepos(accessToken: string): Promise<Repository[]>{
  try {
    // const response = await fetch(
    //   `https://api.github.com/orgs/devhub-hq/repos?type=all`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    const response = await fetch(`https://api.github.com/user/repos?type=private`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok){
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }
    const repos = await response.json();
    const formattedRepos = repos.map((repo: Repository) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      isPrivate: repo.isPrivate,
    }));
    return formattedRepos;
  } catch (error) {
    console.error("Error fetching user repos:", error);
    throw new Error("Failed to fetch user repos");
  }
}


export async function GET(req: NextRequest, res: NextResponse): Promise<NextResponse>{
  const session = await getSession();
  if(!session?.user?.id){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  const accessToken = session.accessToken;
  if(!accessToken){
    return NextResponse.json({error: "No access token"}, {status: 401});
  }
  const repos = await getUserRepos(accessToken);
  return NextResponse.json(repos);
}
