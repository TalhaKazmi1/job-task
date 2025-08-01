"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { taskApi } from "@/lib/api"
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
  assignedTo: number
  dueDate: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  assignedTo?: number
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

  const createTaskMutation = useMutation(taskApi.createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks")
      toast.success("Task created successfully!")
    },
    onError: (error: any) => {
      console.error("Failed to create task:", error)
      toast.error("Failed to create task")
    },
  })

  const updateTaskMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateTaskData }) => taskApi.updateTask(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks")
        toast.success("Task updated successfully!")
      },
      onError: (error: any) => {
        console.error("Failed to update task:", error)
        toast.error("Failed to update task")
      },
    },
  )

  const deleteTaskMutation = useMutation(taskApi.deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks")
      toast.success("Task deleted successfully!")
    },
    onError: (error: any) => {
      console.error("Failed to delete task:", error)
      toast.error("Failed to delete task")
    },
  })

  const createTask = async (data: CreateTaskData) => {
    await createTaskMutation.mutateAsync(data)
  }

  const updateTask = async (id: number, data: UpdateTaskData) => {
    await updateTaskMutation.mutateAsync({ id, data })
  }

  const deleteTask = async (id: number) => {
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
