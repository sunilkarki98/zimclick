import * as React from "react"
import { Button } from "./Button"
import { AlertTriangle, X } from "lucide-react"

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />
      <div className="relative z-50 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-dark'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "primary"} 
            onClick={onConfirm} 
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
