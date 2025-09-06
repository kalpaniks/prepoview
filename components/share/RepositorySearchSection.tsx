import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ChevronDown, Clock, ArrowUpDown, FileText, GitBranch } from 'lucide-react';
import type { Repository } from '@/types/share';
import RepositorySearchResult from './RepositorySearchResult';
import { Skeleton } from '../ui/skeleton';

interface RepositorySearchSectionProps {
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'name' | 'updated' | 'size';
  onSortChange: (sortBy: 'name' | 'updated' | 'size') => void;
  languageFilter: string;
  onLanguageFilterChange: (language: string) => void;
  availableLanguages: string[];
  hasSearchQuery: boolean;
  filteredRepositories: Repository[];
  onRepositoryShare: (repository: Repository) => void;
  isFetching: boolean;
}

function SearchEmptyState() {
  return (
    <div className="py-8 text-center">
      <div className="relative mb-6">
        <Search className="text-muted-foreground/20 mx-auto h-16 w-16" />
        {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl" /> */}
      </div>
      <h3 className="mb-3 text-xl font-semibold">Find repositories to share</h3>
      <p className="text-muted-foreground mx-auto mb-6 max-w-lg text-sm leading-relaxed">
        Start typing to search through your private repositories. You can search by repository name,
        description, programming language, or the team that owns it.
      </p>
      <div className="text-muted-foreground flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Search by name</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Filter by language</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Sort by updates</span>
        </div>
      </div>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="py-8 text-center">
      <GitBranch className="text-muted-foreground/50 mx-auto mb-3 h-8 w-8" />
      <h3 className="mb-1 font-medium">No repositories found</h3>
      <p className="text-muted-foreground text-sm">
        Try adjusting your search query or filter criteria
      </p>
    </div>
  );
}

function SearchFilterControls({
  onSortChange,
  onLanguageFilterChange,
  availableLanguages,
}: {
  onSortChange: (sortBy: 'name' | 'updated' | 'size') => void;
  onLanguageFilterChange: (language: string) => void;
  availableLanguages: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border/60 flex shrink-0 items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter & Sort
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onSortChange('updated')}>
            <Clock className="mr-2 h-4 w-4" />
            Last updated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('name')}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Name (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('size')}>
            <FileText className="mr-2 h-4 w-4" />
            Repository size
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onLanguageFilterChange('all')}>
            All languages
          </DropdownMenuItem>
          {availableLanguages.map((language) => (
            <DropdownMenuItem key={language} onClick={() => onLanguageFilterChange(language)}>
              {language}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchResults({
  hasSearchQuery,
  filteredRepositories,
  languageFilter,
  onRepositoryShare,
  isLoading,
  isFetching,
}: {
  hasSearchQuery: boolean;
  filteredRepositories: Repository[];
  languageFilter: string;
  onRepositoryShare: (repository: Repository) => void;
  isLoading: boolean;
  isFetching: boolean;
}) {
  if (!hasSearchQuery) {
    return <SearchEmptyState />;
  }

  if (hasSearchQuery && (isLoading || isFetching)) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span
          className="bg-muted/70 inline-block h-3 w-3 animate-pulse rounded-full"
          aria-live="polite"
        />
        Searching repositories…
      </div>
    );
  }

  if (filteredRepositories.length === 0) {
    return <NoResultsState />;
  }

  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {filteredRepositories.length} repositories found
        </p>
        {languageFilter !== 'all' && (
          <Badge variant="secondary" className="text-xs">
            {languageFilter} only
          </Badge>
        )}
      </div>
      {filteredRepositories.map((repo) => (
        <RepositorySearchResult key={repo.id} repository={repo} onShare={onRepositoryShare} />
      ))}
    </div>
  );
}

export default function RepositorySearchSection(props: RepositorySearchSectionProps) {
  const {
    searchQuery,
    onSearchChange,
    onSortChange,
    languageFilter,
    onLanguageFilterChange,
    availableLanguages,
    hasSearchQuery,
    filteredRepositories,
    onRepositoryShare,
    isLoading,
    isFetching,
  } = props;

  return (
    <Card className="bg-card/40 border-border/60">
      {/* <CardHeader>
        <CardTitle className="text-lg">Find Repository to Share</CardTitle>
        <CardDescription>
          Search through your private repositories to share with collaborators
        </CardDescription>
      </CardHeader> */}
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search repositories by name, description, or language..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-input/30 border-border/60 pl-10"
            />
          </div>

          {hasSearchQuery && (
            <SearchFilterControls
              onSortChange={onSortChange}
              onLanguageFilterChange={onLanguageFilterChange}
              availableLanguages={availableLanguages}
            />
          )}
        </div>

        <SearchResults
          hasSearchQuery={hasSearchQuery}
          filteredRepositories={filteredRepositories}
          languageFilter={languageFilter}
          onRepositoryShare={onRepositoryShare}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </CardContent>
    </Card>
  );
}
