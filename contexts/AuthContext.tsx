"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { authApi } from "@/lib/api"
import toast from "react-hot-toast"

interface User {
  id: number
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    const token = Cookies.get("token")
    const userData = Cookies.get("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        Cookies.remove("token")
        Cookies.remove("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authApi.login(email, password)

      if (response.success) {
        const token = `mock-jwt-token-${response.user.id}`
        Cookies.set("token", token, { expires: 7 })
        Cookies.set("user", JSON.stringify(response.user), { expires: 7 })
        setUser(response.user)
        toast.success("Welcome back!")
        return true
      } else {
        toast.error(response.message || "Login failed")
        return false
      }
    } catch (error) {
      toast.error("Login failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authApi.register(email, password, name)

      if (response.success) {
        const token = `mock-jwt-token-${response.user.id}`
        Cookies.set("token", token, { expires: 7 })
        Cookies.set("user", JSON.stringify(response.user), { expires: 7 })
        setUser(response.user)
        toast.success("Account created successfully!")
        return true
      } else {
        toast.error(response.message || "Registration failed")
        return false
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove("token")
    Cookies.remove("user")
    setUser(null)
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
