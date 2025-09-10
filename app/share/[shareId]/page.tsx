import EditorViewLayout from '@/components/editor/EditorViewLayout';
import { Github, Calendar, FileText } from 'lucide-react';
import { getShareDetails } from '@/lib/share';
import Link from 'next/link';

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

async function getShare(shareId: string) {
  try {
    const shareData = await getShareDetails(shareId);
    return {
      shareId: shareData.id,
      repoName: shareData.repoName,
      repoOwner: shareData.repoOwner,
      createdAt: shareData.createdAt,
    };
  } catch (error) {
    console.error(error);
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;
  const shareData = await getShare(shareId);
  if (!shareData) {
    return <div>Share not found</div>;
  }

  return (
    <div className="bg-bg-muted flex h-screen w-full flex-col">
      <div className="border-border-default bg-bg-default border-b shadow-sm">
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-2">
                <Github className="text-fg-muted h-5 w-5" />
                <nav className="text-md flex items-center space-x-1">
                  <Link
                    href={`https://github.com/${shareData.repoOwner}`}
                    className="text-fg-accent cursor-pointer font-medium hover:underline"
                  >
                    {shareData.repoOwner}
                  </Link>
                  <span className="text-fg-muted">/</span>
                  <span className="text-fg-accent cursor-pointer font-medium hover:underline">
                    {shareData.repoName}
                  </span>
                </nav>

                <span className="border-border-default bg-bg-muted text-fg-muted inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium">
                  Private
                </span>
              </div>
            </div>

            <div className="text-fg-muted flex flex-col items-end text-sm">
              <div className="mb-1 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Shared {new Date(shareData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border-muted border-b px-6">
          <nav className="flex space-x-8">
            <div className="border-fg-accent text-fg-default flex items-center space-x-2 border-b-2 py-3">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Code</span>
            </div>
            <div className="nav-tab-inactive flex cursor-pointer items-center space-x-2 py-3">
              <span className="text-sm">Issues</span>
              <span className="bg-bg-muted text-fg-muted rounded-full px-2 py-0.5 text-xs">0</span>
            </div>
            <div className="nav-tab-inactive flex cursor-pointer items-center space-x-2 py-3">
              <span className="text-sm">Pull requests</span>
              <span className="bg-bg-muted text-fg-muted rounded-full px-2 py-0.5 text-xs">0</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="bg-bg-muted flex-1 overflow-hidden">
        <EditorViewLayout shareData={shareData} />
      </div>
    </div>
  );
}
