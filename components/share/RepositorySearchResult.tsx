import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';
import type { Repository } from '@/types/share';
import { getLanguageColor } from '@/utils/share/helpers';

interface RepositorySearchResultProps {
  repository: Repository;
  onShare: (repository: Repository) => void;
}

export default function RepositorySearchResult({
  repository,
  onShare,
}: RepositorySearchResultProps) {
  return (
    <div className="group border-border/60 hover:border-primary/30 hover:bg-accent/30 animate-in fade-in slide-in-from-bottom-1 flex items-center justify-between rounded-md border p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="text-muted-foreground h-4 w-4 shrink-0" />
          <div
            className={`h-2.5 w-2.5 rounded-full ${getLanguageColor(repository.language)} shrink-0`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-sm font-medium tracking-tight">{repository.name}</h3>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {repository.language}
            </Badge>
          </div>
          <p className="text-muted-foreground line-clamp-1 text-xs">{repository.description}</p>
          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-[11px]">
            <span>{repository.size}</span>
            {/* <span>Updated {repository.updatedAt.toLocaleDateString()}</span> */}
            <span className="truncate">by {repository?.owner?.login}</span>
          </div>
        </div>
      </div>

      <Button size="sm" onClick={() => onShare(repository)} className="ml-4 shrink-0">
        <Plus className="mr-1 h-3 w-3" />
        Share
      </Button>
    </div>
  );
}
