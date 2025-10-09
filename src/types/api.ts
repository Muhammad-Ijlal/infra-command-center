import { AxiosError } from 'axios'

export interface ApiResponse<T> {
  data: T
}

export interface ApiErrorResponse {
  status?: string
  message?: string | Record<string, string[]>
  detail?: string
  errors?: Record<string, string[]>
}

export type ApiAxiosError = AxiosError<ApiErrorResponse>

export function getErrorMessage(error: Error): string {
  if ('isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as ApiAxiosError

    // Check if message is an object with field errors
    if (axiosError.response?.data?.message && typeof axiosError.response.data.message === 'object') {
      const messageObj = axiosError.response.data.message as Record<string, string[]>
      const firstError = Object.values(messageObj)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0]
      }
    }

    // Check for field-specific errors in errors field
    if (axiosError.response?.data?.errors) {
      const errors = axiosError.response.data.errors
      const firstError = Object.values(errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0]
      }
    }

    return (
      (typeof axiosError.response?.data?.message === 'string' ? axiosError.response.data.message : undefined) ||
      axiosError.response?.data?.detail ||
      axiosError.message ||
      'An unexpected error occurred'
    )
  }

  return error.message || 'An unexpected error occurred'
}
