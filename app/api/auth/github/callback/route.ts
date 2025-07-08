import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = 'Ov23liRaZOzlnlZ7LkAq';
const GITHUB_CLIENT_SECRET = '51aa6b1d766b3d5956a1c2a734f56b0d7e5d2fdd';
const REDIRECT_URI = 'https://optimanext.vercel.app/api/auth/github/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  // Optionally: Validate state with cookie/session here

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      state,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json({ error: 'Failed to get access token', details: tokenData }, { status: 400 });
  }

  // Fetch user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();
  if (!user.login) {
    return NextResponse.json({ error: 'Failed to fetch user info', details: user }, { status: 400 });
  }

  // Set both token and username in httpOnly cookies
  const response = NextResponse.redirect('/'); // Redirect to app home or dashboard
  response.cookies.set('github_token', tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  response.cookies.set('github_username', user.login, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  return response;
}
