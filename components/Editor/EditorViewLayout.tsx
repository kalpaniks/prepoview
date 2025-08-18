'use client';
import { useState } from 'react';
import EditorFileTree from './EditorFileTree';
import Editor from './EditorFileView';

interface EditorViewLayoutProps {
  shareData: {
    shareId: string;
    repoName: string;
    repoOwner: string;
    fileCount: number;
  };
}

export default function EditorViewLayout({ shareData }: EditorViewLayoutProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (filePath: string) => {
    console.log('📁 Layout: File selected:', filePath);
    setSelectedFile(filePath);
  };

  return (
    <div className="bg-bg-muted flex h-full">
      {/* Left sidebar - File tree */}
      <div className="w-80 flex-shrink-0">
        <EditorFileTree onFileSelect={handleFileSelect} selectedFile={selectedFile} />
      </div>

      {/* Right side - Code editor */}
      <div className="border-border-default bg-bg-default min-w-0 flex-1 border-l shadow-sm">
        <Editor shareId={shareData.shareId} selectedFile={selectedFile} />
      </div>
    </div>
  );
}
