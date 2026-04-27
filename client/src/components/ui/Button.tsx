import * as React from "react"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-black text-white hover:bg-gray-800",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-900"
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base"
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
