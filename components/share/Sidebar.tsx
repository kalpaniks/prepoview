import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Activity, GitBranch, Clock, Settings, Shield } from 'lucide-react';
import type { GitHubProfile, ShareAnalytics, Share } from '@/types/share';
import { truncateEmail, isExpiringSoon } from '@/utils/share/helpers';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface SidebarProps {
  profile: GitHubProfile;
  analytics?: ShareAnalytics;
  isLoading: boolean;
  isFetching: boolean;
}

function GitHubProfileSection({
  profile,
  isLoading,
  isFetching,
}: {
  profile: GitHubProfile;
  isLoading: boolean;
  isFetching: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          {isLoading && isFetching ? (
            <Skeleton className="h-14 w-14 rounded-full" />
          ) : (
            <Image
              src={profile?.avatar_url || ''}
              alt={profile?.name || 'avatar'}
              width={48}
              height={48}
              className="ring-border/50 h-14 w-14 rounded-full object-cover ring-2"
            />
          )}
        </div>

        <div className="my-auto min-w-0">
          {isLoading || isFetching ? (
            <>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </>
          ) : (
            <>
              <h2 className="text-base leading-tight font-semibold">{profile?.name}</h2>
              <p className="text-muted-foreground font-mono text-xs">@{profile?.login}</p>
            </>
          )}
          {/* <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              GitHub {profile?.plan?.name}
            </Badge>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection({ analytics }: { analytics: ShareAnalytics }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">Sharing Analytics</h3>
        <Badge variant="secondary" className="text-xs">
          This month
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/30 border-border/60 rounded-md border p-3">
          <div className="mb-1 flex items-center justify-between">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-lg font-bold">{analytics.activeShares}</span>
          </div>
          <p className="text-muted-foreground text-xs">Active shares</p>
        </div>

        <div className="bg-muted/30 border-border/60 rounded-md border p-3">
          <div className="mb-1 flex items-center justify-between">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold">{analytics.totalViews}</span>
          </div>
          <p className="text-muted-foreground text-xs">Total views</p>
        </div>

        <div className="bg-muted/30 border-border/60 rounded-md border p-3">
          <div className="mb-1 flex items-center justify-between">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-lg font-bold">{analytics.expiringSoon}</span>
          </div>
          <p className="text-muted-foreground text-xs">Expiring soon</p>
        </div>

        <div className="bg-muted/30 border-border/60 rounded-md border p-3">
          <div className="mb-1 flex items-center justify-between">
            <GitBranch className="h-4 w-4 text-purple-500" />
            <span className="text-lg font-bold">{analytics.thisWeekShares}</span>
          </div>
          <p className="text-muted-foreground text-xs">This week</p>
        </div>
      </div>

      {/* Expiring Soon Alert */}
      {analytics.expiringSoon > 0 && (
        <div className="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-800/30 dark:bg-orange-950/20">
          <div className="mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
              {analytics.expiringSoon} shares expiring soon
            </span>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Review and extend access if needed
          </p>
        </div>
      )}
    </div>
  );
}

function RecentActivitySection({ recentActivity }: { recentActivity: Share[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-muted-foreground text-sm font-medium">Recent Activity</h3>

      <div className="space-y-3">
        {recentActivity.length === 0 ? (
          <div className="py-4 text-center">
            <Activity className="text-muted-foreground/50 mx-auto mb-2 h-6 w-6" />
            <p className="text-muted-foreground text-xs">No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            <div className="bg-border/50 absolute top-0 bottom-0 left-2 w-px" />

            {recentActivity.map((share) => {
              const isExpired = share.status === 'expired';
              const isExpiringSoonFlag = isExpiringSoon(share);

              return (
                <div key={share.id} className="relative flex items-start gap-3 pb-3">
                  <div
                    className={`border-background relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      isExpired
                        ? 'bg-red-500'
                        : isExpiringSoonFlag
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                    }`}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{share.repoName}</span>
                      <Badge
                        variant={
                          isExpired
                            ? 'destructive'
                            : isExpiringSoonFlag
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="shrink-0 text-xs"
                      >
                        {isExpired ? 'Expired' : isExpiringSoonFlag ? 'Soon' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Shared with{' '}
                      <span className="font-mono">{truncateEmail(share.sharedWith)}</span>
                    </p>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>
                        {share.viewCount}/{share.viewLimit} views
                      </span>
                      <span>•</span>
                      <span>{share.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionsSection() {
  return (
    <div className="border-border/50 bg-card/30 sticky bottom-0 mt-auto border-t px-6 pt-4 pb-4">
      <div className="space-y-1.5">
        <Button variant="ghost" className="h-8 w-full justify-start text-sm" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Sharing Settings
        </Button>
        <Button variant="ghost" className="h-8 w-full justify-start text-sm" size="sm">
          <Shield className="mr-2 h-4 w-4" />
          Security & Permissions
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar({
  profile,
  analytics = {
    activeShares: 0,
    totalViews: 0,
    expiringSoon: 0,
    thisWeekShares: 0,
    recentActivity: [],
  },
  isLoading,
  isFetching,
}: SidebarProps) {
  return (
    <div className="border-border/60 bg-card/30 w-72 overflow-y-auto border-r">
      <div className="flex h-full flex-col space-y-6 p-6">
        <GitHubProfileSection profile={profile} isLoading={isLoading} isFetching={isFetching} />
        <div className="border-border/50 border-t" />
        <AnalyticsSection analytics={analytics} />
        <div className="border-border/50 border-t" />
        <RecentActivitySection recentActivity={analytics.recentActivity} />
        <QuickActionsSection />
      </div>
    </div>
  );
}
