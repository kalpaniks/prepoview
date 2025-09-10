'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Loader2 } from 'lucide-react';

interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
}

interface TreeViewProps {
  data: GitHubItem[];
  onFileSelect: (filePath: string) => void;
  selectedFile: string | null;
  shareId: string;
  onLoadDirectory?: (directoryPath: string, items: GitHubItem[]) => void;
}

export default function TreeView({
  data,
  onFileSelect,
  selectedFile,
  shareId,
  onLoadDirectory,
}: TreeViewProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loadingDirs, setLoadingDirs] = useState<Set<string>>(new Set());
  const [loadedDirs, setLoadedDirs] = useState<Set<string>>(new Set(['']));

  const getRootItems = (): GitHubItem[] => {
    return data
      .filter((item) => !item.path.includes('/') || item.path.split('/').length === 1)
      .sort((a, b) => {
        if (a.type === 'dir' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      });
  };

  const getDirectoryChildren = (parentPath: string): GitHubItem[] => {
    const normalizedParentPath = parentPath === '' ? '' : parentPath + '/';

    return data
      .filter((item) => {
        if (parentPath === '') {
          return !item.path.includes('/');
        }

        const itemPath = item.path;
        if (!itemPath.startsWith(normalizedParentPath)) return false;

        const relativePath = itemPath.slice(normalizedParentPath.length);
        return !relativePath.includes('/');
      })
      .sort((a, b) => {
        if (a.type === 'dir' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      });
  };

  const fetchDirectoryContents = async (directoryPath: string): Promise<GitHubItem[]> => {
    const encodedPath = encodeURIComponent(directoryPath);
    const response = await fetch(`/api/share/${shareId}/tree?path=${encodedPath}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch directory: ${response.statusText}`);
    }

    return response.json();
  };

  const handleDirectoryToggle = async (item: GitHubItem) => {
    const { path } = item;

    if (expandedDirs.has(path)) {
      const newExpanded = new Set(expandedDirs);
      newExpanded.delete(path);
      setExpandedDirs(newExpanded);
      return;
    }

    const newExpanded = new Set(expandedDirs);
    newExpanded.add(path);
    setExpandedDirs(newExpanded);

    if (!loadedDirs.has(path)) {
      setLoadingDirs((prev) => new Set(prev).add(path));

      try {
        const directoryContents = await fetchDirectoryContents(path);

        if (onLoadDirectory) {
          onLoadDirectory(path, directoryContents);
        }

        setLoadedDirs((prev) => new Set(prev).add(path));
      } catch (error) {
        console.error(`Error loading directory ${path}:`, error);
        newExpanded.delete(path);
        setExpandedDirs(newExpanded);
      } finally {
        setLoadingDirs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(path);
          return newSet;
        });
      }
    }
  };

  const handleFileClick = (item: GitHubItem) => {
    if (item.type === 'file') {
      onFileSelect(item.path);
    }
  };

  const getFileIcon = (item: GitHubItem) => {
    if (item.type === 'dir') {
      return <Folder className="text-fg-muted h-4 w-4 flex-shrink-0" />;
    }

    const iconColor = 'text-fg-muted';

    // switch (extension) {
    //   case 'js':
    //   case 'jsx':
    //     iconColor = 'text-yellow-500';
    //     break;
    //   case 'ts':
    //   case 'tsx':
    //     iconColor = 'text-blue-600';
    //     break;
    //   case 'py':
    //     iconColor = 'text-green-600';
    //     break;
    //   case 'json':
    //     iconColor = 'text-yellow-600';
    //     break;
    //   case 'md':
    //   case 'mdx':
    //     iconColor = 'text-blue-500';
    //     break;
    //   case 'css':
    //   case 'scss':
    //   case 'sass':
    //     iconColor = 'text-pink-500';
    //     break;
    //   case 'html':
    //   case 'htm':
    //     iconColor = 'text-red-500';
    //     break;
    //   case 'vue':
    //     iconColor = 'text-green-500';
    //     break;
    //   case 'php':
    //     iconColor = 'text-purple-500';
    //     break;
    //   case 'java':
    //     iconColor = 'text-orange-600';
    //     break;
    //   case 'xml':
    //   case 'svg':
    //     iconColor = 'text-orange-500';
    //     break;
    //   case 'yml':
    //   case 'yaml':
    //     iconColor = 'text-red-400';
    //     break;
    // }

    return <File className={`h-4 w-4 ${iconColor} flex-shrink-0`} />;
  };

  const renderTreeItem = (item: GitHubItem, level: number): React.ReactNode => {
    const isDirectory = item.type === 'dir';
    const isExpanded = expandedDirs.has(item.path);
    const isLoading = loadingDirs.has(item.path);
    const isSelected = !isDirectory && item.path === selectedFile;

    return (
      <div key={item.sha}>
        <div
          className={`group hover:bg-bg-muted flex cursor-pointer items-center px-3 py-1.5 text-sm transition-colors duration-150 ease-in-out select-none ${
            isSelected
              ? 'border-fg-accent bg-bg-muted text-fg-accent border-r-2'
              : 'text-fg-default'
          }`}
          style={{
            paddingLeft: `${level * 18 + 12}px`,
          }}
          onClick={() => {
            if (isDirectory) {
              handleDirectoryToggle(item);
            } else {
              handleFileClick(item);
            }
          }}
        >
          {isDirectory && (
            <span className="text-fg-muted group-hover:text-fg-default mr-1.5 flex-shrink-0">
              {isLoading ? (
                <Loader2 className="text-fg-accent h-4 w-4 animate-spin" />
              ) : isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}

          <span className="mr-2.5">{getFileIcon(item)}</span>

          <span className="truncate font-medium">{item.name}</span>
        </div>

        {isDirectory && isExpanded && !isLoading && (
          <div>
            {getDirectoryChildren(item.path).map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const buildTree = (): React.ReactNode[] => {
    const rootItems = getRootItems();
    return rootItems.map((item) => renderTreeItem(item, 0));
  };

  return (
    <div className="border-border-default bg-bg-default h-full overflow-y-auto border-r shadow-sm">
      <div className="border-border-default bg-bg-muted border-b px-4 py-3">
        <h2 className="text-fg-default text-base font-medium">Files</h2>
      </div>

      <div className="py-2">
        {data.length === 0 ? (
          <div className="text-fg-muted px-4 py-8 text-center">
            <Folder className="mx-auto mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          <div>{buildTree()}</div>
        )}
      </div>
    </div>
  );
}
