import axios from 'axios'
import Cookies from 'js-cookie'

const TOKEN_COOKIE_NAME = 'token'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_COOKIE_NAME)

    if (token) {
      config.headers.Authorization = `JWT ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/token/refresh/')
    ) {
      originalRequest._retry = true

      const oldToken = Cookies.get(TOKEN_COOKIE_NAME)

      if (oldToken) {
        try {
          const response = await apiClient.post<{ token: string }>(
            '/v1/users/token/refresh/',
            { refresh: oldToken }
          )

          const newToken = response.data.token

          if (newToken) {
            Cookies.set(TOKEN_COOKIE_NAME, newToken, {
              expires: 29,
              sameSite: 'lax',
              secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
            })

            originalRequest.headers.Authorization = `JWT ${newToken}`

            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          Cookies.remove(TOKEN_COOKIE_NAME)

          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }

          return Promise.reject(refreshError)
        }
      }

      Cookies.remove(TOKEN_COOKIE_NAME)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
