import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isMock = searchParams.get('mock') === 'true'

  const client_id = process.env.SPOTIFY_CLIENT_ID
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/spotify'
  
  // If credentials are not set or mock query is active, fallback to simulation
  if (!client_id || isMock) {
    const mockCallbackUrl = `${redirect_uri}?code=mock_auth_code&state=claro_soundstage_mock`
    return NextResponse.redirect(mockCallbackUrl)
  }

  const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state'
  const state = 'claro_soundstage'

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`
  
  return NextResponse.redirect(spotifyAuthUrl)
}
