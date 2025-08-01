"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <ProfileContent />
      </div>
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user } = useAuth()

  return (
    <div className="flex-1 overflow-auto lg:ml-0">
      <div className="p-6 lg:p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="max-w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
  className="h-20 w-20 rounded-full object-cover"
  src="/admin.png"
  alt={user?.name}
/>

                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2 h-4 w-4" />
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-2 h-4 w-4" />
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline mr-2 h-4 w-4" />
                    Role
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">{user?.role}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-2 h-4 w-4" />
                    Member Since
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">January 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Last updated 30 days ago</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
