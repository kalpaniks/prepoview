'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import TreeView from '../ui/TreeView';

interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
}

interface FileTreeProps {
  onFileSelect: (filePath: string) => void;
  selectedFile: string | null;
}

export default function EditorFileTree({ onFileSelect, selectedFile }: FileTreeProps) {
  const [allTreeData, setAllTreeData] = useState<GitHubItem[]>([]);
  const { shareId } = useParams();
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!shareId) return;

      try {
        setIsInitialLoading(true);
        setError(null);

        const response = await fetch(`/api/share/${shareId}/tree`);
        if (!response.ok) {
          throw new Error(`Failed to fetch repository: ${response.statusText}`);
        }

        const rootData: GitHubItem[] = await response.json();
        setAllTreeData(rootData);
      } catch (error) {
        console.error('Error fetching initial tree data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [shareId]);

  const handleLoadDirectory = (directoryPath: string, newItems: GitHubItem[]) => {
    setAllTreeData((prevData) => {
      const existingPaths = new Set(prevData.map((item) => item.path));

      const uniqueNewItems = newItems.filter((item) => !existingPaths.has(item.path));

      return [...prevData, ...uniqueNewItems];
    });
  };

  if (isInitialLoading) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          borderRight: '1px solid var(--borderColor-default)',
          backgroundColor: 'var(--bgColor-default)',
        }}
      >
        <div className="text-center">
          <Loader2
            className="mx-auto mb-3 h-8 w-8 animate-spin"
            style={{ color: 'var(--fgColor-accent)' }}
          />
          <p className="text-sm" style={{ color: 'var(--fgColor-muted)' }}>
            Loading repository...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          borderRight: '1px solid var(--borderColor-default)',
          backgroundColor: 'var(--bgColor-default)',
        }}
      >
        <div className="max-w-xs text-center" style={{ color: 'var(--fgColor-danger)' }}>
          <AlertCircle className="mx-auto mb-3 h-8 w-8" />
          <p className="mb-2 text-sm font-medium">Failed to load repository</p>
          <p className="text-xs" style={{ color: 'var(--fgColor-muted)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <TreeView
      data={allTreeData}
      onFileSelect={onFileSelect}
      selectedFile={selectedFile}
      shareId={shareId as string}
      onLoadDirectory={handleLoadDirectory}
    />
  );
}
