"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "@/contexts/AuthContext"
import { TaskProvider } from "@/contexts/TaskContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <TaskProvider>{children}</TaskProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
