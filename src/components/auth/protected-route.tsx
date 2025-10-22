'use client'

import { useSupabase } from '@/lib/providers/supabase-provider'
import { LoginForm } from '@/components/auth/login-form'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useSupabase()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Add a small delay to prevent flash of loading screen
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Show loading only on initial load, not on subsequent auth checks
  if (loading && !showContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <>{children}</>
}
