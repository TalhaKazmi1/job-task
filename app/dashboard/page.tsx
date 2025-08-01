"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Sidebar } from "@/components/Sidebar"
import { RealTimeIndicator } from "@/components/RealTimeIndicator"
import { useAuth } from "@/contexts/AuthContext"
import { useTasks } from "@/contexts/TaskContext"
import { useWebSocket } from "@/contexts/WebSocketContext"
import { getStatusColor, getPriorityColor } from "@/lib/utils"
import { CheckSquare, Clock, AlertCircle, TrendingUp, Users, Calendar, Wifi } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent />
        <RealTimeIndicator />
      </div>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { tasks, loading } = useTasks()
  const { isConnected, recentActivity } = useWebSocket()

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    pending: tasks.filter((task) => task.status === "pending").length,
  }

  const myTasks = tasks.filter((task) => task.assignedTo === user?.id)
  const recentTasks = tasks.slice(0, 5)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto lg:ml-0">
      <div className="p-6 lg:p-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Here's what's happening with your tasks today.</p>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Tasks" value={stats.total} icon={CheckSquare} color="bg-blue-500" delay="0ms" />
          <StatCard title="Completed" value={stats.completed} icon={TrendingUp} color="bg-green-500" delay="100ms" />
          <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="bg-yellow-500" delay="200ms" />
          <StatCard title="Pending" value={stats.pending} icon={AlertCircle} color="bg-red-500" delay="300ms" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-slide-up">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  My Tasks
                </h2>
              </div>
              <div className="p-6">
                {myTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks assigned to you</p>
                ) : (
                  <div className="space-y-4">
                    {myTasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Live Activity
                </h2>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === "task_create"
                                ? "bg-green-500"
                                : activity.type === "task_update"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay,
}: {
  title: string
  value: number
  icon: any
  color: string
  delay: string
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-bounce-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center">
        <div className={`${color} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
