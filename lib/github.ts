import path from 'path';

export async function getTree(repoName: string, repoOwner: string, accessToken: string) {
  const repoResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
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
        Accept: 'application/vnd.github.v3+json',
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
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  const data = await response.json();
  const res = {
    name: data.name,
    path: data.path,
    sha: data.sha,
    content: data.content,
    size: data.size,
    type: data.type,
    encoding: data.encoding,
  };
  return res;
}

export async function getBaseTree(repoName: string, repoOwner: string, accessToken: string) {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getCommitHistory(
  repoName: string,
  repoOwner: string,
  accessToken: string,
  page = 1,
  perPage = 30
) {
  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/commits?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch commits: ${response.status} - ${errorData.message}`);
  }

  const commits = await response.json();
  return commits.map((commit: any) => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: {
      name: commit.commit.author.name,
      email: commit.commit.author.email,
      date: commit.commit.author.date,
      avatar: commit.author?.avatar_url || null,
      username: commit.author?.login || null,
    },
    committer: {
      name: commit.commit.committer.name,
      email: commit.commit.committer.email,
      date: commit.commit.committer.date,
    },
    url: commit.html_url,
    stats: commit.stats,
  }));
}
