import RepositoryShareLayout from '@/components/Repository/RepositoryViewLayout';
import { Github, Calendar, FileText } from 'lucide-react';

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
    <div className="flex h-screen w-full flex-col bg-white">
      {/* GitHub-style header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <Github className="h-8 w-8 text-gray-900" />
          <div className="flex-1">
            <h1 className="flex items-center text-xl font-semibold text-gray-900">
              <span className="text-blue-600">{shareData.repoOwner}</span>
              <span className="mx-2 text-gray-400">/</span>
              <span>{shareData.repoName}</span>
            </h1>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Shared {new Date(shareData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{shareData.fileCount} files</span>
              </div>
              <div className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                {shareData.shareId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <RepositoryShareLayout shareData={shareData} />
      </div>
    </div>
  );
}
