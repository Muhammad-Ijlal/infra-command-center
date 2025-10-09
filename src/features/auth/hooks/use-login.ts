"use client"

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth-service'
import { tokenManager } from '@/src/lib/auth/token'
import type { LoginCredentials } from '../types'

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      tokenManager.set(data.access)
      router.push('/early-access-users')
    },
  })
}
