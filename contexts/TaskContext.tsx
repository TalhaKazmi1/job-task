"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { taskApi } from "@/lib/api"
import { useWebSocket } from "./WebSocketContext"
import toast from "react-hot-toast"

export interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo: number
  createdBy: number
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  dueDate?: string
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: number, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  refetch: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { emitTaskUpdate, emitTaskCreate, emitTaskDelete } = useWebSocket()

  const {
    data: tasks = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery("tasks", taskApi.getTasks, {
    refetchInterval: 30000,
    retry: 1,
    onError: (error: any) => {
      console.error("Failed to fetch tasks:", error)
    },
  })

  // Listen for real-time updates and refresh data
  useEffect(() => {
    const handleRealTimeUpdate = () => {
      queryClient.invalidateQueries("tasks")
    }

    const interval = setInterval(() => {
      refetch()
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [queryClient, refetch])

  const createTaskMutation = useMutation(taskApi.createTask, {
    onSuccess: (newTask) => {
      console.log("[TaskContext] Task created successfully:", newTask)
      queryClient.invalidateQueries("tasks")
      toast.success("Task created successfully!")

      // Emit WebSocket event with proper data
      emitTaskCreate({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
      })
    },
    onError: (error: any) => {
      console.error("Failed to create task:", error)
      toast.error("Failed to create task")
    },
  })

  const updateTaskMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateTaskData }) => taskApi.updateTask(id, data),
    {
      onSuccess: (updatedTask, { id, data }) => {
        console.log("[TaskContext] Task updated successfully:", updatedTask)
        queryClient.invalidateQueries("tasks")
        toast.success("Task updated successfully!")

        // Find the task to get its title
        const task = tasks.find((t) => t.id === id)

        // Emit WebSocket event with proper data
        emitTaskUpdate({
          id,
          title: task?.title || data.title || "Unknown Task",
          description: task?.description || data.description,
          status: data.status || task?.status,
          priority: data.priority || task?.priority,
        })
      },
      onError: (error: any) => {
        console.error("Failed to update task:", error)
        toast.error("Failed to update task")
      },
    },
  )

  const deleteTaskMutation = useMutation(taskApi.deleteTask, {
    onSuccess: (_, taskId) => {
      console.log("[TaskContext] Task deleted successfully:", taskId)

      // Find the task before it's removed to get its title
      const task = tasks.find((t) => t.id === taskId)

      queryClient.invalidateQueries("tasks")
      toast.success("Task deleted successfully!")

      // Emit WebSocket event with proper data
      emitTaskDelete(taskId, task?.title || "Unknown Task")
    },
    onError: (error: any) => {
      console.error("Failed to delete task:", error)
      toast.error("Failed to delete task")
    },
  })

  const createTask = async (data: CreateTaskData) => {
    console.log("[TaskContext] Creating task:", data)
    await createTaskMutation.mutateAsync(data)
  }

  const updateTask = async (id: number, data: UpdateTaskData) => {
    console.log("[TaskContext] Updating task:", id, data)
    await updateTaskMutation.mutateAsync({ id, data })
  }

  const deleteTask = async (id: number) => {
    console.log("[TaskContext] Deleting task:", id)
    await deleteTaskMutation.mutateAsync(id)
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error: error ? "Failed to load tasks" : null,
        createTask,
        updateTask,
        deleteTask,
        refetch,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
