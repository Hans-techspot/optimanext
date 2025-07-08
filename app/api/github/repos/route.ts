import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Helper to get Octokit instance from token
function getOctokit(token: string) {
  return new Octokit({ auth: token });
}

// GET: List user repos
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Missing GitHub token' }, { status: 401 });
  }
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      per_page: 100,
      sort: 'updated',
    });
    return NextResponse.json({ repos: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Create new repo (default public)
export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Missing GitHub token' }, { status: 401 });
  }
  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Repository name required' }, { status: 400 });
  }
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: false, // default to public
    });
    return NextResponse.json({ repo: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
