'use client'

import { QueryClient } from '@tanstack/react-query'

// Create a singleton QueryClient instance
// This ensures we have one instance per request in SSR
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: How long data is considered fresh
        // 60 seconds = data won't refetch for 60s even if component remounts
        staleTime: 60 * 1000, // 1 minute
        
        // GC time (garbage collection): How long unused/inactive cache data stays in memory
        // In TanStack Query v5, cacheTime was renamed to gcTime
        // 5 minutes = keep cached data for 5min after component unmounts
        gcTime: 5 * 60 * 1000, // 5 minutes
        
        // Don't refetch on window focus (better for mobile, saves data)
        refetchOnWindowFocus: false,
        
        // Don't refetch on reconnect (better for poor networks)
        refetchOnReconnect: false,
        
        // Retry logic: Only retry once on failure (faster failure on poor networks)
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Network mode: prefer cache-first for better offline/poor network experience
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: use singleton pattern to keep the same query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
