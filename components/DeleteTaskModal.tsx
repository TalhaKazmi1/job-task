"use client"

import { AlertTriangle, X } from "lucide-react"

interface DeleteTaskModalProps {
  isOpen: boolean
  taskTitle: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export function DeleteTaskModal({ isOpen, taskTitle, onConfirm, onCancel, isDeleting = false }: DeleteTaskModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-bounce-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isDeleting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the task{" "}
              <span className="font-semibold text-gray-900">"{taskTitle}"</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Task</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
