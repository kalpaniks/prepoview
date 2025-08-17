import EditorViewLayout from '@/components/Editor/EditorViewLayout';
import { Github, Calendar, FileText, Star, GitFork, Eye } from 'lucide-react';

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

async function getShare(shareId: string) {
  return {
    shareId,
    repoName: 'btc-price-prediction',
    repoOwner: 'joshua-ng',
    createdAt: new Date().toISOString(),
    fileCount: 10,
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;
  const shareData = await getShare(shareId);

  return (
    <div
      className="flex h-screen w-full flex-col"
      style={{ backgroundColor: 'var(--bgColor-muted)' }}
    >

      <div
        className="shadow-sm"
        style={{
          borderBottom: '1px solid var(--borderColor-default)',
          backgroundColor: 'var(--bgColor-default)',
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-2">
                <Github className="h-5 w-5" style={{ color: 'var(--fgColor-muted)' }} />
                <nav className="flex items-center space-x-1 text-sm">
                  <span
                    className="cursor-pointer font-medium hover:underline"
                    style={{ color: 'var(--fgColor-accent)' }}
                  >
                    {shareData.repoOwner}
                  </span>
                  <span style={{ color: 'var(--fgColor-muted)' }}>/</span>
                  <span
                    className="cursor-pointer text-lg font-semibold hover:underline"
                    style={{ color: 'var(--fgColor-accent)' }}
                  >
                    {shareData.repoName}
                  </span>
                </nav>

                <span
                  className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  style={{
                    border: '1px solid var(--borderColor-default)',
                    backgroundColor: 'var(--bgColor-muted)',
                    color: 'var(--fgColor-muted)',
                  }}
                >
                  Public
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button className="btn-theme flex items-center space-x-1 rounded-md px-3 py-1 text-sm">
                  <Star className="h-4 w-4" />
                  <span>Star</span>
                </button>
                <button className="btn-theme flex items-center space-x-1 rounded-md px-3 py-1 text-sm">
                  <GitFork className="h-4 w-4" />
                  <span>Fork</span>
                </button>
                <button className="btn-theme flex items-center space-x-1 rounded-md px-3 py-1 text-sm">
                  <Eye className="h-4 w-4" />
                  <span>Watch</span>
                </button>
              </div>
            </div>

            <div
              className="flex flex-col items-end text-sm"
              style={{ color: 'var(--fgColor-muted)' }}
            >
              <div className="mb-1 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Shared {new Date(shareData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{shareData.fileCount} files</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6" style={{ borderBottom: '1px solid var(--borderColor-muted)' }}>
          <nav className="flex space-x-8">
            <div
              className="flex items-center space-x-2 py-3"
              style={{
                borderBottom: '2px solid var(--fgColor-accent)',
                color: 'var(--fgColor-default)',
              }}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Code</span>
            </div>
            <div className="nav-tab-inactive flex cursor-pointer items-center space-x-2 py-3">
              <span className="text-sm">Issues</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: 'var(--bgColor-muted)',
                  color: 'var(--fgColor-muted)',
                }}
              >
                0
              </span>
            </div>
            <div className="nav-tab-inactive flex cursor-pointer items-center space-x-2 py-3">
              <span className="text-sm">Pull requests</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: 'var(--bgColor-muted)',
                  color: 'var(--fgColor-muted)',
                }}
              >
                0
              </span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--bgColor-muted)' }}>
        <EditorViewLayout shareData={shareData} />
      </div>
    </div>
  );
}
