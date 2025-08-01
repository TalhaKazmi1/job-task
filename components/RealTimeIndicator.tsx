"use client"

import { useWebSocket } from "@/contexts/WebSocketContext"
import { Wifi, WifiOff, Activity } from "lucide-react"

export function RealTimeIndicator() {
  const { isConnected, recentActivity } = useWebSocket()

  console.log("[RealTimeIndicator] Current activity:", recentActivity)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <span className="text-sm font-medium">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Recent Activity</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {recentActivity.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="text-xs text-gray-600 p-2 bg-gray-50 rounded border-l-2 border-blue-200"
                >
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Recent Activity</h4>
            <p className="text-xs text-gray-500">No recent activity</p>
          </div>
        )}

        {isConnected && (
          <div className="mt-3 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live updates active</span>
          </div>
        )}
      </div>
    </div>
  )
}
