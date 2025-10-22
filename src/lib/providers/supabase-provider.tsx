'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { UserProfile } from '@/types/user'

interface SupabaseContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

// Cache keys for localStorage
const CACHE_KEYS = {
  USER_PROFILE: 'supabase_user_profile',
  SESSION_CACHE: 'supabase_session_cache',
} as const

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

interface CachedData<T> {
  data: T
  timestamp: number
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const { data, timestamp }: CachedData<T> = JSON.parse(cached)
    
    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch {
    return null
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cached))
  } catch {
    // Ignore localStorage errors
  }
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  // Memoized fetchUserProfile with caching
  const fetchUserProfile = useCallback(async (userId: string, useCache: boolean = true) => {
    // Try cache first if enabled
    if (useCache) {
      const cachedProfile = getCachedData<UserProfile>(`${CACHE_KEYS.USER_PROFILE}_${userId}`)
      if (cachedProfile) {
        setUserProfile(cachedProfile)
        return cachedProfile
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setUserProfile(null)
        return null
      } else {
        setUserProfile(data)
        // Cache the profile
        setCachedData(`${CACHE_KEYS.USER_PROFILE}_${userId}`, data)
        return data
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setUserProfile(null)
      return null
    }
  }, [])

  // Optimized auth state management
  useEffect(() => {
    let mounted = true
    let authInitialized = false

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch profile with cache on initial load
          await fetchUserProfile(session.user.id, true)
        }
        
        authInitialized = true
        setLoading(false)
        setInitialLoad(false)
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setLoading(false)
          setInitialLoad(false)
        }
      }
    }

    // Listen for auth changes with optimized loading states
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      // Only show loading for actual sign in/out events, not token refresh
      const shouldShowLoading = event === 'SIGNED_IN' || event === 'SIGNED_OUT'
      
      if (shouldShowLoading && !authInitialized) {
        setLoading(true)
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Use cache for subsequent profile fetches
        await fetchUserProfile(session.user.id, true)
      } else {
        setUserProfile(null)
        // Clear cached profile on sign out
        if (user?.id) {
          localStorage.removeItem(`${CACHE_KEYS.USER_PROFILE}_${user.id}`)
        }
      }
      
      if (shouldShowLoading) {
        setLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile, user?.id])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    // Clear cached data on sign out
    if (user?.id) {
      localStorage.removeItem(`${CACHE_KEYS.USER_PROFILE}_${user.id}`)
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [user?.id])

  const value = useMemo(() => ({
    user,
    userProfile,
    session,
    loading: loading && initialLoad, // Only show loading on initial load
    signIn,
    signOut,
  }), [user, userProfile, session, loading, initialLoad, signIn, signOut])

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
