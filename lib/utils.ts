import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GithubFileTree {
  name: string;
  path: string;
  sha: string;
  size?: number;
  url?: string;
  type: string;
}

interface TreeItem {
  id: string;
  name: string;
  parent: number;
  isBranch: boolean;
  path: string;
}

export function transformGithubResponseTree(githubItems : GithubFileTree[], parent: number = 0): TreeItem[] {
  const reposne = githubItems.map((item) => {
    return {
      id: item.sha,
      name: item.name,
      isBranch: item.type == 'file' ? false : true,
      path: item.path,
      parent: parent
    }
  })
  return reposne;
}
