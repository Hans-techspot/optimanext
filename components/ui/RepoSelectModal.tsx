import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Input } from './input';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description?: string;
}

interface RepoSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (repo: Repo) => void;
  onCreate: (repo: Repo) => void;
  token: string;
}

export function RepoSelectModal({ open, onClose, onSelect, onCreate, token }: RepoSelectModalProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/github/repos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRepos(data.repos || []))
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, [open, token]);

  const handleCreate = async () => {
    if (!newRepoName) return setError('Repository name required');
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/github/repos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRepoName, description: newRepoDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        onCreate(data.repo);
        setNewRepoName('');
        setNewRepoDesc('');
      } else {
        setError(data.error || 'Failed to create repo');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or Create Repository</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="font-medium">Your Repositories</div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul className="max-h-40 overflow-auto border rounded">
              {repos.map(repo => (
                <li key={repo.id} className="flex items-center justify-between px-2 py-1 hover:bg-accent cursor-pointer" onClick={() => onSelect(repo)}>
                  <span>{repo.name}</span>
                  {repo.private && <span className="text-xs ml-2">Private</span>}
                </li>
              ))}
              {repos.length === 0 && <li className="px-2 py-1 text-muted-foreground">No repositories found.</li>}
            </ul>
          )}
        </div>
        <div className="space-y-1 pt-2 border-t mt-2">
          <div className="font-medium">Create New Repository</div>
          <Input placeholder="Repository name" value={newRepoName} onChange={e => setNewRepoName(e.target.value)} />
          <Input placeholder="Description (optional)" value={newRepoDesc} onChange={e => setNewRepoDesc(e.target.value)} />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Button onClick={handleCreate} disabled={creating} className="mt-1 w-full">Create Public Repository</Button>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}