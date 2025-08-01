import type { Socket } from "socket.io-client"

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId: number) {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = this.createMockSocket(userId)
    this.setupEventListeners()
    return this.socket
  }

  private createMockSocket(userId: number): Socket {
    const mockSocket = {
      connected: true,
      id: `mock-socket-${userId}`,
      emit: (event: string, data: any) => {
        console.log(`[WebSocket] Emitting: ${event}`, data)
        // Simulate server broadcasting to other clients
        setTimeout(() => {
          this.handleMockServerResponse(event, data)
        }, 500)
      },
      on: (event: string, callback: Function) => {
        console.log(`[WebSocket] Listening for: ${event}`)
        if (!this.eventCallbacks) {
          this.eventCallbacks = new Map()
        }
        if (!this.eventCallbacks.has(event)) {
          this.eventCallbacks.set(event, [])
        }
        this.eventCallbacks.get(event).push(callback)
      },
      off: (event: string, callback?: Function) => {
        if (this.eventCallbacks?.has(event)) {
          if (callback) {
            const callbacks = this.eventCallbacks.get(event)
            const index = callbacks.indexOf(callback)
            if (index > -1) {
              callbacks.splice(index, 1)
            }
          } else {
            this.eventCallbacks.delete(event)
          }
        }
      },
      disconnect: () => {
        this.connected = false
        console.log("[WebSocket] Disconnected")
      },
    } as any

    setTimeout(() => {
      this.triggerEvent("connect", {})
    }, 500)

    return mockSocket
  }

  private eventCallbacks = new Map<string, Function[]>()

  private handleMockServerResponse(event: string, data: any) {
    // Simulate server broadcasting the event back to all clients
    switch (event) {
      case "join_room":
        this.triggerEvent("room_joined", { room: data.room })
        break
      case "task_update":
        // Simulate broadcasting task update to all clients
        this.triggerEvent("task_updated", {
          ...data,
          timestamp: new Date().toISOString(),
        })
        break
      case "task_create":
        // Simulate broadcasting task creation to all clients
        this.triggerEvent("task_created", {
          ...data,
          timestamp: new Date().toISOString(),
        })
        break
      case "task_delete":
        // Simulate broadcasting task deletion to all clients
        this.triggerEvent("task_deleted", {
          ...data,
          timestamp: new Date().toISOString(),
        })
        break
    }
  }

  private triggerEvent(event: string, data: any) {
    const callbacks = this.eventCallbacks?.get(event) || []
    callbacks.forEach((callback) => callback(data))
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("[WebSocket] Connected to server")
      this.reconnectAttempts = 0
    })

    this.socket.on("disconnect", (reason) => {
      console.log("[WebSocket] Disconnected:", reason)
      this.handleReconnection()
    })

    this.socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error)
      this.handleReconnection()
    })
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          console.log("[WebSocket] Reconnection attempt...")
        }
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit("join_room", { room })
    }
  }

  leaveRoom(room: string) {
    if (this.socket) {
      this.socket.emit("leave_room", { room })
    }
  }

  emitTaskUpdate(taskData: any) {
    if (this.socket) {
      console.log("[WebSocket] Emitting task update:", taskData)
      this.socket.emit("task_update", taskData)
    }
  }

  emitTaskCreate(taskData: any) {
    if (this.socket) {
      console.log("[WebSocket] Emitting task create:", taskData)
      this.socket.emit("task_create", taskData)
    }
  }

  emitTaskDelete(taskData: any) {
    if (this.socket) {
      console.log("[WebSocket] Emitting task delete:", taskData)
      this.socket.emit("task_delete", taskData)
    }
  }

  onTaskUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("task_updated", callback)
    }
  }

  onTaskCreate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("task_created", callback)
    }
  }

  onTaskDelete(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("task_deleted", callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const websocketManager = new WebSocketManager()
