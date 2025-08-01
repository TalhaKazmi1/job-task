import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "@/contexts/AuthContext"
import { TaskProvider } from "@/contexts/TaskContext"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TaskProvider>{children}</TaskProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe("Task Management", () => {
  it("renders task filters", () => {
    const TasksContent = require("@/app/tasks/page").default

    render(
      <TestWrapper>
        <TasksContent />
      </TestWrapper>,
    )

    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument()
    expect(screen.getByDisplayValue("All Status")).toBeInTheDocument()
    expect(screen.getByDisplayValue("All Priority")).toBeInTheDocument()
  })

  it("filters tasks by status", () => {
    const TasksContent = require("@/app/tasks/page").default

    render(
      <TestWrapper>
        <TasksContent />
      </TestWrapper>,
    )

    const statusFilter = screen.getByDisplayValue("All Status")
    fireEvent.change(statusFilter, { target: { value: "completed" } })

    expect(statusFilter).toHaveValue("completed")
  })
})
