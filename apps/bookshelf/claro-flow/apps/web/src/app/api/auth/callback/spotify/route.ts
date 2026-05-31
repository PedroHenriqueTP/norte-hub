import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const homeUrl = new URL('/', request.url)

  if (error) {
    homeUrl.searchParams.set('spotify_error', error)
    return NextResponse.redirect(homeUrl)
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/spotify'

  // If credentials are not set or mock flow is activated, simulate a connected user
  if (!client_id || !client_secret || state === 'claro_soundstage_mock' || code === 'mock_auth_code') {
    homeUrl.searchParams.set('spotify_connected', 'true')
    homeUrl.searchParams.set('spotify_user_name', 'Pedrão Keep')
    homeUrl.searchParams.set('spotify_user_avatar', '')
    homeUrl.searchParams.set('spotify_token', 'mock_token_claro_soundstage_12345')
    return NextResponse.redirect(homeUrl)
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code || '',
        redirect_uri: redirect_uri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      homeUrl.searchParams.set('spotify_error', tokenData.error_description || 'token_exchange_failed')
      return NextResponse.redirect(homeUrl)
    }

    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    homeUrl.searchParams.set('spotify_connected', 'true')
    homeUrl.searchParams.set('spotify_user_name', userData.display_name || 'Usuário Spotify')
    homeUrl.searchParams.set('spotify_user_avatar', userData.images?.[0]?.url || '')
    homeUrl.searchParams.set('spotify_token', tokenData.access_token)
    
    return NextResponse.redirect(homeUrl)

  } catch (err) {
    console.error('Spotify Callback Error:', err)
    homeUrl.searchParams.set('spotify_error', 'connection_error')
    return NextResponse.redirect(homeUrl)
  }
}
