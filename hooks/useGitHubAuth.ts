import { useCallback, useEffect, useState } from 'react';

interface AuthStatus {
  authenticated: boolean;
  username?: string;
  token?: string;
}

export function useGitHubAuth() {
  const [status, setStatus] = useState<AuthStatus>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/github');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setStatus({ authenticated: false });
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = useCallback((redirectPath?: string) => {
    // If a redirectPath is provided, encode it in the state param
    const state = redirectPath
      ? `${crypto.randomUUID()}::${encodeURIComponent(redirectPath)}`
      : crypto.randomUUID();
    const url = `/api/auth/github?action=authorize&state=${state}`;
    window.location.href = url;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await fetch('/api/auth/github', { method: 'DELETE' });
    setStatus({ authenticated: false });
    setLoading(false);
  }, []);

  return { ...status, loading, error, login, logout, refresh: checkStatus };
}
