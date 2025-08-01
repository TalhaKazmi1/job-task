"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { websocketManager } from "@/lib/websocket"
import toast from "react-hot-toast"

interface WebSocketContextType {
  isConnected: boolean
  recentActivity: ActivityEvent[]
  emitTaskUpdate: (taskData: any) => void
  emitTaskCreate: (taskData: any) => void
  emitTaskDelete: (taskId: number, taskTitle?: string) => void
}

interface ActivityEvent {
  id: string
  type: "task_update" | "task_create" | "task_delete"
  message: string
  timestamp: string
  taskId?: number
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([])

  useEffect(() => {
    if (user) {
      console.log("[WebSocket] Setting up WebSocket for user:", user.name)
      const socket = websocketManager.connect(user.id)
      setIsConnected(true)

      websocketManager.joinRoom(`user_${user.id}`)
      websocketManager.joinRoom("general")

      // Set up event listeners
      const handleTaskUpdate = (data: any) => {
        console.log("[WebSocket] Received task update:", data)
        addActivity({
          id: `update-${Date.now()}`,
          type: "task_update",
          message: `Task "${data.title || "Unknown"}" was updated`,
          timestamp: data.timestamp || new Date().toISOString(),
          taskId: data.id,
        })

        toast.success(`Task updated: ${data.title}`, {
          duration: 3000,
          icon: "🔄",
        })
      }

      const handleTaskCreate = (data: any) => {
        console.log("[WebSocket] Received task create:", data)
        addActivity({
          id: `create-${Date.now()}`,
          type: "task_create",
          message: `New task "${data.title}" was created`,
          timestamp: data.timestamp || new Date().toISOString(),
          taskId: data.id,
        })

        toast.success(`New task created: ${data.title}`, {
          duration: 3000,
          icon: "✨",
        })
      }

      const handleTaskDelete = (data: any) => {
        console.log("[WebSocket] Received task delete:", data)
        addActivity({
          id: `delete-${Date.now()}`,
          type: "task_delete",
          message: `Task "${data.title || "Unknown"}" was deleted`,
          timestamp: data.timestamp || new Date().toISOString(),
          taskId: data.taskId,
        })

        toast.success(`Task deleted: ${data.title}`, {
          duration: 3000,
          icon: "🗑️",
        })
      }

      websocketManager.onTaskUpdate(handleTaskUpdate)
      websocketManager.onTaskCreate(handleTaskCreate)
      websocketManager.onTaskDelete(handleTaskDelete)

      return () => {
        console.log("[WebSocket] Cleaning up WebSocket")
        websocketManager.disconnect()
        setIsConnected(false)
      }
    }
  }, [user])

  const addActivity = (activity: ActivityEvent) => {
    console.log("[WebSocket] Adding activity:", activity)
    setRecentActivity((prev) => {
      const newActivity = [activity, ...prev.slice(0, 9)]
      console.log("[WebSocket] Updated activity list:", newActivity)
      return newActivity
    })
  }

  const emitTaskUpdate = (taskData: any) => {
    console.log("[WebSocket] Emitting task update from context:", taskData)
    websocketManager.emitTaskUpdate({
      ...taskData,
      updatedBy: user?.name,
    })
  }

  const emitTaskCreate = (taskData: any) => {
    console.log("[WebSocket] Emitting task create from context:", taskData)
    websocketManager.emitTaskCreate({
      ...taskData,
      createdBy: user?.name,
    })
  }

  const emitTaskDelete = (taskId: number, taskTitle?: string) => {
    console.log("[WebSocket] Emitting task delete from context:", { taskId, taskTitle })
    websocketManager.emitTaskDelete({
      taskId,
      title: taskTitle,
      deletedBy: user?.name,
    })
  }

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        recentActivity,
        emitTaskUpdate,
        emitTaskCreate,
        emitTaskDelete,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
