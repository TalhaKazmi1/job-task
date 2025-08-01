import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = "http://localhost:3001"

// Fallback data when JSON server is not available
const fallbackUsers = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
]

const fallbackTasks = [
  {
    id: 1,
    title: "Setup Project Architecture",
    description: "Initialize the project structure and configure development environment",
    status: "completed",
    priority: "high",
    assignedTo: 1,
    createdBy: 1,
    dueDate: "2024-01-15T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Implement Authentication",
    description: "Create login and registration functionality with JWT tokens",
    status: "in-progress",
    priority: "high",
    assignedTo: 2,
    createdBy: 1,
    dueDate: "2024-01-20T00:00:00.000Z",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-12T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Design Task Dashboard",
    description: "Create responsive dashboard for task management",
    status: "pending",
    priority: "medium",
    assignedTo: 2,
    createdBy: 1,
    dueDate: "2024-01-25T00:00:00.000Z",
    createdAt: "2024-01-08T00:00:00.000Z",
    updatedAt: "2024-01-08T00:00:00.000Z",
  },
]

// Store data in localStorage for persistence
const getStoredData = (key: string, fallback: any[]) => {
  if (typeof window === "undefined") return fallback

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return fallback
    }
  }

  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

const setStoredData = (key: string, data: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Check if JSON server is available
let isJsonServerAvailable = true

const checkJsonServer = async () => {
  try {
    await api.get("/users", { timeout: 2000 })
    return true
  } catch (error) {
    return false
  }
}

export const authApi = {
  async login(email: string, password: string) {
    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.get("/users")
          const users = response.data
          const user = users.find((u: any) => u.email === email && u.password === password)

          if (user) {
            const { password: _, ...userWithoutPassword } = user
            return { success: true, user: userWithoutPassword }
          } else {
            return { success: false, message: "Invalid credentials" }
          }
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      const users = getStoredData("users", fallbackUsers)
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        const { password: _, ...userWithoutPassword } = user
        return { success: true, user: userWithoutPassword }
      } else {
        return { success: false, message: "Invalid credentials" }
      }
    } catch (error) {
      throw new Error("Login failed")
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      let users = []

      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.get("/users")
          users = response.data
          const existingUser = users.find((u: any) => u.email === email)

          if (existingUser) {
            return { success: false, message: "User already exists" }
          }

          const newUser = {
            id: Date.now(),
            email,
            password,
            name,
            role: "user",
            avatar: `/placeholder.svg?height=40&width=40&query=${name.replace(" ", "+")}+avatar`,
            createdAt: new Date().toISOString(),
          }

          await api.post("/users", newUser)
          const { password: _, ...userWithoutPassword } = newUser
          return { success: true, user: userWithoutPassword }
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      users = getStoredData("users", fallbackUsers)
      const existingUser = users.find((u: any) => u.email === email)

      if (existingUser) {
        return { success: false, message: "User already exists" }
      }

      const newUser = {
        id: Date.now(),
        email,
        password,
        name,
        role: "user",
        avatar: `/placeholder.svg?height=40&width=40&query=${name.replace(" ", "+")}+avatar`,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      setStoredData("users", users)

      const { password: _, ...userWithoutPassword } = newUser
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      throw new Error("Registration failed")
    }
  },
}

export const taskApi = {
  async getTasks() {
    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.get("/tasks")
          return response.data
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      return getStoredData("tasks", fallbackTasks)
    } catch (error) {
      return getStoredData("tasks", fallbackTasks)
    }
  },

  async createTask(data: any) {
    const userCookie = Cookies.get("user")
    const user = userCookie ? JSON.parse(userCookie) : null

    const newTask = {
      ...data,
      id: Date.now(),
      status: "pending",
      createdBy: user?.id || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.post("/tasks", newTask)
          return response.data
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      const tasks = getStoredData("tasks", fallbackTasks)
      tasks.push(newTask)
      setStoredData("tasks", tasks)
      return newTask
    } catch (error) {
      const tasks = getStoredData("tasks", fallbackTasks)
      tasks.push(newTask)
      setStoredData("tasks", tasks)
      return newTask
    }
  },

  async updateTask(id: number, data: any) {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.patch(`/tasks/${id}`, updatedData)
          return response.data
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      const tasks = getStoredData("tasks", fallbackTasks)
      const taskIndex = tasks.findIndex((task: any) => task.id === id)
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
        setStoredData("tasks", tasks)
        return tasks[taskIndex]
      }
      throw new Error("Task not found")
    } catch (error) {
      const tasks = getStoredData("tasks", fallbackTasks)
      const taskIndex = tasks.findIndex((task: any) => task.id === id)
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
        setStoredData("tasks", tasks)
        return tasks[taskIndex]
      }
      throw new Error("Task not found")
    }
  },

  async deleteTask(id: number) {
    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.delete(`/tasks/${id}`)
          return response.data
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      const tasks = getStoredData("tasks", fallbackTasks)
      const filteredTasks = tasks.filter((task: any) => task.id !== id)
      setStoredData("tasks", filteredTasks)
      return { success: true }
    } catch (error) {
      const tasks = getStoredData("tasks", fallbackTasks)
      const filteredTasks = tasks.filter((task: any) => task.id !== id)
      setStoredData("tasks", filteredTasks)
      return { success: true }
    }
  },
}

export const userApi = {
  async getUsers() {
    try {
      // Try JSON server first
      if (isJsonServerAvailable) {
        try {
          const response = await api.get("/users")
          return response.data.map((user: any) => {
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
          })
        } catch (error) {
          isJsonServerAvailable = false
        }
      }

      // Fallback to localStorage
      const users = getStoredData("users", fallbackUsers)
      return users.map((user: any) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
    } catch (error) {
      const users = getStoredData("users", fallbackUsers)
      return users.map((user: any) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
    }
  },
}

// Initialize JSON server availability check
if (typeof window !== "undefined") {
  checkJsonServer().then((available) => {
    isJsonServerAvailable = available
    if (!available) {
      console.log("JSON Server not available, using localStorage fallback")
    }
  })
}
