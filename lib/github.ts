import prisma from '@/lib/prisma';

export async function getTree(
  repoName: string,
  repoOwner: string,
  accessToken: string,
  branch: string = 'main'
) {
  const repoResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!repoResponse.ok) {
    const errorData = await repoResponse.json();
    throw new Error(`Failed to fetch repository: ${repoResponse.status} - ${errorData.message}`);
  }

  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;

  const treeResponse = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${defaultBranch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!treeResponse.ok) {
    const errorData = await treeResponse.json();
    throw new Error(`Failed to fetch tree: ${treeResponse.status} - ${errorData.message}`);
  }

  return treeResponse.json();
}

export async function getFile(
  repoName: string,
  repoOwner: string,
  accessToken: string,
  filePath: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
}

export async function getBaseTree(repoName: string, repoOwner: string, accessToken: string) {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

