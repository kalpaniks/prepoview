'use client';
import { useState } from 'react';
import RepositoryFileTree from './RepositoryFileTree';
import CodeEditor from './CodeEditor';

interface RepositoryViewLayoutProps {
  shareData: {
    shareId: string;
    repoName: string;
    repoOwner: string;
    fileCount: number;
  };
}

export default function RepositoryViewLayout({ shareData }: RepositoryViewLayoutProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex h-full bg-white">
      {/* Left sidebar - File tree */}
      <div className="w-80 flex-shrink-0">
        <RepositoryFileTree
          shareId={shareData.shareId}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
      </div>

      {/* Right side - Code editor */}
      <div className="min-w-0 flex-1">
        <CodeEditor shareId={shareData.shareId} selectedFile={selectedFile} />
      </div>
    </div>
  );
}
