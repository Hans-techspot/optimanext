import { Octokit } from '@octokit/rest';

export async function pushChanges({
  token,
  owner,
  repo,
  branch = 'main',
  files,
  commitMessage,
}: {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  files: { path: string; content: string }[];
  commitMessage: string;
}) {
  const octokit = new Octokit({ auth: token });

  // Get the latest commit
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const latestCommitSha = refData.object.sha;

  // Get the tree of the latest commit
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commitData.tree.sha;

  // Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'utf-8',
      });
      return { path: file.path, sha: blob.data.sha, mode: '100644', type: 'blob' };
    })
  );

  // Create a new tree
  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: blobs,
  });

  // Create a new commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: tree.sha,
    parents: [latestCommitSha],
  });

  // Update the ref to point to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.sha,
  });

  return newCommit;
}

export async function fetchCommits({
  token,
  owner,
  repo,
  branch = 'main',
  perPage = 10,
}: {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  perPage?: number;
}) {
  const octokit = new Octokit({ auth: token });
  const { data: commits } = await octokit.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: perPage,
  });
  return commits;
}
