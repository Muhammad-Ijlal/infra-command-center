import Cookies from 'js-cookie'

const TOKEN_COOKIE_NAME = 'token'

export const tokenManager = {
  get: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME)
  },

  set: (token: string): void => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: 29,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    })
  },

  remove: (): void => {
    Cookies.remove(TOKEN_COOKIE_NAME)
  },

  exists: (): boolean => {
    return !!Cookies.get(TOKEN_COOKIE_NAME)
  },
}
