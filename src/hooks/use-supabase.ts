import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

interface UseSupabaseQueryOptions<T> {
  table: string
  select?: string
  filters?: Record<string, string | number | boolean>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
}

interface UseSupabaseQueryResult<T> {
  data: T[] | null
  loading: boolean
  error: PostgrestError | null
  refetch: () => Promise<void>
}

export function useSupabaseQuery<T = Record<string, unknown>>({
  table,
  select = '*',
  filters = {},
  orderBy,
  limit
}: UseSupabaseQueryOptions<T>): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  // Memoize filters and orderBy to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])
  const memoizedOrderBy = useMemo(() => orderBy, [JSON.stringify(orderBy)])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table).select(select)

      // Apply filters
      Object.entries(memoizedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // Apply ordering
      if (memoizedOrderBy) {
        query = query.order(memoizedOrderBy.column, { ascending: memoizedOrderBy.ascending ?? true })
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit)
      }

      const { data: result, error: queryError } = await query

      if (queryError) {
        setError(queryError)
        setData(null)
      } else {
        setData(result as T[])
      }
    } catch (err) {
      setError(err as PostgrestError)
    } finally {
      setLoading(false)
    }
  }, [table, select, memoizedFilters, memoizedOrderBy, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

interface UseSupabaseMutationOptions<T> {
  table: string
  onSuccess?: (data: T) => void
  onError?: (error: PostgrestError) => void
}

interface UseSupabaseMutationResult<T> {
  mutate: (data: Partial<T>) => Promise<{ data: T | null; error: PostgrestError | null }>
  loading: boolean
}

export function useSupabaseMutation<T = Record<string, unknown>>({
  table,
  onSuccess,
  onError
}: UseSupabaseMutationOptions<T>): UseSupabaseMutationResult<T> {
  const [loading, setLoading] = useState(false)

  const mutate = async (data: Partial<T>) => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      if (error) {
        onError?.(error)
        return { data: null, error }
      }

      onSuccess?.(result)
      return { data: result, error: null }
    } catch (err) {
      const error = err as PostgrestError
      onError?.(error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    mutate,
    loading
  }
}

interface UseSupabaseUpdateOptions<T> {
  table: string
  onSuccess?: (data: T) => void
  onError?: (error: PostgrestError) => void
}

interface UseSupabaseUpdateResult<T> {
  update: (id: string | number, data: Partial<T>) => Promise<{ data: T | null; error: PostgrestError | null }>
  loading: boolean
}

export function useSupabaseUpdate<T = Record<string, unknown>>({
  table,
  onSuccess,
  onError
}: UseSupabaseUpdateOptions<T>): UseSupabaseUpdateResult<T> {
  const [loading, setLoading] = useState(false)

  const update = async (id: string | number, data: Partial<T>) => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        onError?.(error)
        return { data: null, error }
      }

      onSuccess?.(result)
      return { data: result, error: null }
    } catch (err) {
      const error = err as PostgrestError
      onError?.(error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    update,
    loading
  }
}

interface UseSupabaseDeleteOptions {
  table: string
  onSuccess?: () => void
  onError?: (error: PostgrestError) => void
}

interface UseSupabaseDeleteResult {
  deleteRecord: (id: string | number) => Promise<{ error: PostgrestError | null }>
  loading: boolean
}

export function useSupabaseDelete({
  table,
  onSuccess,
  onError
}: UseSupabaseDeleteOptions): UseSupabaseDeleteResult {
  const [loading, setLoading] = useState(false)

  const deleteRecord = async (id: string | number) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        onError?.(error)
        return { error }
      }

      onSuccess?.()
      return { error: null }
    } catch (err) {
      const error = err as PostgrestError
      onError?.(error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteRecord,
    loading
  }
}
