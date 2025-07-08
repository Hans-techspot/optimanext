import { useState } from 'react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Github } from 'lucide-react';

interface GitHubVersionControlMenuProps {
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSelectRepo?: () => void;
  onPushChanges?: () => void;
  onViewCommits?: () => void;
  repoName?: string;
}

export function GitHubVersionControlMenu({
  isAuthenticated = false,
  onSignIn,
  onSelectRepo,
  onPushChanges,
  onViewCommits,
  repoName,
}: GitHubVersionControlMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 px-3 py-1.5 hover:bg-accent/50 transition-colors rounded-md"
          aria-label="GitHub Version Control"
        >
          <Github className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium ml-1.5">
            {repoName ? repoName : 'GitHub'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {!isAuthenticated ? (
          <DropdownMenuItem onClick={onSignIn}>
            Sign in with GitHub
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={onSelectRepo}>
              {repoName ? 'Change Repository' : 'Select Repository'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPushChanges}>
              Push Changes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewCommits}>
              View Commits
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
