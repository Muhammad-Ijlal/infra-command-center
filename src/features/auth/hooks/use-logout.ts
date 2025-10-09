"use client"

import { useRouter } from 'next/navigation'
import { tokenManager } from '@/src/lib/auth/token'

export function useLogout() {
  const router = useRouter()

  const logout = () => {
    tokenManager.remove()
    router.push('/login')
    router.refresh()
  }

  return { logout }
}
