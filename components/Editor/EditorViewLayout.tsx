'use client';
import { useState, useEffect } from 'react';
import EditorFileTree from './EditorFileTree';
import Editor from './EditorFileView';

interface EditorViewLayoutProps {
  shareData: {
    shareId: string;
    repoName: string;
    repoOwner: string;
    createdAt: Date;
  };
}

export default function EditorViewLayout({ shareData }: EditorViewLayoutProps) {
  const [access, setAccess] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/share/${shareData.shareId}/handshake`, {
        method: 'POST',
        credentials: 'include',
      });
      if (cancelled) return;
      const data = await res.json();
      setAccess(data.success ? 'granted' : 'denied');
    })();
    return () => {
      cancelled = true;
    };
  }, [shareData.shareId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/share/${shareData.shareId}/status`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccess(data.hasAccess ? 'granted' : 'denied');
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [shareData.shareId]);

  if (access === 'checking') return <div className="p-6">Checking access…</div>;
  if (access === 'denied') return <div className="p-6">Access expired or limit reached.</div>;

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  return (
    <div className="bg-bg-muted flex h-full">
      {/* Left sidebar  */}
      <div className="w-80 flex-shrink-0">
        <EditorFileTree onFileSelect={handleFileSelect} selectedFile={selectedFile} />
      </div>

      {/* Right side  */}
      <div className="border-border-default bg-bg-default min-w-0 flex-1 border-l shadow-sm">
        <Editor shareId={shareData.shareId} selectedFile={selectedFile} />
      </div>
    </div>
  );
}
