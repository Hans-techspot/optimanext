import { NextRequest, NextResponse } from 'next/server';

// GitHub OAuth App configuration (OptimaNext)
const GITHUB_CLIENT_ID = 'Ov23liRaZOzlnlZ7LkAq';
const GITHUB_CLIENT_SECRET = '51aa6b1d766b3d5956a1c2a734f56b0d7e5d2fdd';
const REDIRECT_URI = 'https://optimanext.vercel.app/api/auth/github/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // OAuth authorize flow
  if (action === 'authorize') {
    const scopes = 'repo user:email';
    const state = crypto.randomUUID();
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600
    });
    return response;
  }

  // Status check
  const githubToken = request.cookies.get('github_token')?.value;
  const githubUsername = request.cookies.get('github_username')?.value;

  if (!githubToken || !githubUsername) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const userData = await response.json();
    return NextResponse.json({
      authenticated: true,
      username: userData.login,
      token: githubToken
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('github_token');
  response.cookies.delete('github_username');
  return response;
}
