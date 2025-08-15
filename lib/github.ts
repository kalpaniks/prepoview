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

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

/**
 * Transform flat GitHub tree response into nested tree structure
 * This converts the flat list from GitHub Trees API into a hierarchical structure
 * that react-accessible-treeview can consume
 */
export function transformGitHubTreeToNested(flatTree: GitHubTreeItem[]): FileNode[] {
  const pathMap = new Map<string, FileNode>();
  const rootChildren: FileNode[] = [];

  // First pass: Create all nodes
  for (const item of flatTree) {
    const pathParts = item.path.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const node: FileNode = {
      name: fileName,
      path: item.path,
      type: item.type === 'blob' ? 'file' : 'directory',
      children: item.type === 'tree' ? [] : undefined,
    };

    pathMap.set(item.path, node);
  }

  // Second pass: Build the tree structure
  for (const item of flatTree) {
    const node = pathMap.get(item.path)!;
    const pathParts = item.path.split('/');

    if (pathParts.length === 1) {
      // Root level item
      rootChildren.push(node);
    } else {
      // Find parent directory
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentNode = pathMap.get(parentPath);

      if (parentNode && parentNode.children) {
        parentNode.children.push(node);
      }
    }
  }

  // Sort directories first, then files, both alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .sort((a, b) => {
        // Directories first
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        // Then alphabetically
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
  };

  return sortNodes(rootChildren);
}
