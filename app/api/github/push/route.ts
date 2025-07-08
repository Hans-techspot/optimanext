import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

// Helper: Get token from cookies
function getToken(request: NextRequest): string | null {
  return request.cookies.get('github_token')?.value || null;
}

// Helper: Validate payload
function validatePayload(body: any) {
  if (!body.repo || !body.files || !Array.isArray(body.files) || body.files.length === 0) {
    return 'Missing repo or files.';
  }
  if (!body.commitMessage || typeof body.commitMessage !== 'string') {
    return 'Missing or invalid commit message.';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { repo, files, commitMessage, branch = 'main' } = body;
  const octokit = new Octokit({ auth: token });
  let owner: string;

  // Get username (owner)
  try {
    const user = await octokit.rest.users.getAuthenticated();
    owner = user.data.login;
  } catch {
    return NextResponse.json({ error: 'Failed to get user info.' }, { status: 500 });
  }

  try {
    // 1. Get latest commit on branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });
    const latestCommitSha = refData.object.sha;

    // 2. Get commit and tree
    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha
    });
    const baseTree = commitData.tree.sha;

    // 3. Create blobs for each file
    const blobs = await Promise.all(files.map(async (file: any) => {
      const blob = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'utf-8',
      });
      return { path: file.path, mode: '100644', type: 'blob', sha: blob.data.sha };
    }));

    // 4. Create new tree
    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTree,
      tree: blobs,
    });

    // 5. Create commit
    const { data: commit } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: treeData.sha,
      parents: [latestCommitSha],
    });

    // 6. Update branch ref
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commit.sha,
    });

    return NextResponse.json({ success: true, commit: commit.sha });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Push failed.' }, { status: 500 });
  }
}
