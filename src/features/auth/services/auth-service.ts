import { apiClient } from '@/src/lib/api/client'
import type { LoginCredentials } from '../types'

const ENDPOINTS = {
  LOGIN: '/v1/users/login/',
  TOKEN_REFRESH: '/v1/users/token/refresh/',
}

export interface LoginResponse {
  access: string
  refresh: string
  data?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
}

export interface TokenRefreshResponse {
  status: boolean
  token?: string
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.LOGIN,
      credentials
    )
    return response.data
  },

  tokenRefresh: async (oldToken: string): Promise<TokenRefreshResponse> => {
    try {
      const response = await apiClient.post<{ token: string }>(
        ENDPOINTS.TOKEN_REFRESH,
        { refresh: oldToken }
      )
      return {
        status: true,
        token: response.data.token,
      }
    } catch {
      return {
        status: false,
      }
    }
  },
}
