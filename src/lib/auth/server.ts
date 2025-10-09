import { cookies } from 'next/headers'

const TOKEN_COOKIE_NAME = 'token'

export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getServerToken()
  return !!token
}

export async function requireAuth(): Promise<string> {
  const token = await getServerToken()

  if (!token) {
    throw new Error('Unauthorized')
  }

  return token
}
