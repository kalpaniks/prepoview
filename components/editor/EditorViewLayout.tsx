'use client';
import { useState, useEffect } from 'react';
import EditorFileTree from './EditorFileTree';
import Editor from './EditorFileView';
import CommitHistory from './CommitHistory';
import { Button } from '@/components/ui/button';
import { SidebarClose, FileText, GitCommit } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'commits'>('code');
  const isMobile = useMobile();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/share/${shareData.shareId}/handshake`, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store',
        });
        if (cancelled) return;
        if (!res.ok) {
          setAccess('denied');
          return;
        }
        setAccess('granted');
      } catch {
        if (!cancelled) setAccess('denied');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shareData.shareId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/share/${shareData.shareId}/status?ts=${Date.now()}`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          setAccess('granted');
        } else {
          setAccess('denied');
        }
      } catch {
        setAccess('denied');
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [shareData.shareId]);

  // Ensure overlay state resets when switching to desktop
  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  if (access === 'checking') {
    return <div className="p-6">Checking access…</div>;
  }
  if (access === 'denied') {
    return <div className="p-6">Access expired or limit reached.</div>;
  }

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="bg-bg-muted relative flex h-full flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-border-default bg-bg-default border-b px-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'border-fg-accent text-fg-default'
                : 'border-transparent text-fg-muted hover:text-fg-default'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`flex items-center space-x-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'commits'
                ? 'border-fg-accent text-fg-default'
                : 'border-transparent text-fg-muted hover:text-fg-default'
            }`}
          >
            <GitCommit className="h-4 w-4" />
            <span>Commits</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <>
            {/* Left sidebar  */}
            <div className="w-0 md:w-80 md:flex-shrink-0">
              <div
                className={`border-border-default bg-bg-default absolute top-0 bottom-0 left-0 z-50 h-full w-80 transform border-r transition-transform duration-200 ease-out md:static md:w-auto md:translate-x-0 ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="absolute top-2 right-2 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close file tree"
                  >
                    <SidebarClose className="h-5 w-5" />
                  </Button>
                </div>
                <EditorFileTree onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              </div>
            </div>

            {isSidebarOpen && (
              <div
                className="absolute inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Right side  */}
            <div className="border-border-default bg-bg-default min-w-0 flex-1 border-l shadow-sm">
              <Editor
                shareId={shareData.shareId}
                selectedFile={selectedFile}
                onSidebarOpen={() => setIsSidebarOpen(true)}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <CommitHistory shareId={shareData.shareId} />
          </div>
        )}
      </div>
    </div>
  );
}
