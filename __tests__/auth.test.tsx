import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import LoginPage from "@/app/auth/login/page"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe("Authentication", () => {
  it("renders login form", () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>,
    )

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>,
    )

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter your email")).toBeInvalid()
      expect(screen.getByPlaceholderText("Enter your password")).toBeInvalid()
    })
  })

  it("toggles password visibility", () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>,
    )

    const passwordInput = screen.getByPlaceholderText("Enter your password")
    const toggleButton = screen.getByRole("button", { name: "" })

    expect(passwordInput).toHaveAttribute("type", "password")

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })
})
