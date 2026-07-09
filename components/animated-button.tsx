"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, type ButtonHTMLAttributes } from "react"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "destructive" | "success" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  loading?: boolean
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const variantStyles = {
    primary: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-[0_0_30px_oklch(0.65_0.18_180_/_0.4)]",
    destructive: "bg-gradient-to-r from-destructive to-[oklch(0.65_0.18_25)] text-destructive-foreground hover:shadow-[0_0_30px_oklch(0.55_0.2_25_/_0.4)]",
    success: "bg-gradient-to-r from-[oklch(0.55_0.22_150)] to-[oklch(0.65_0.2_130)] text-foreground hover:shadow-[0_0_30px_oklch(0.55_0.22_150_/_0.4)]",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
    ghost: "bg-transparent text-foreground hover:bg-secondary/50"
  }

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <button
      className={cn(
        "group relative w-full overflow-hidden rounded-xl font-semibold",
        "transition-all duration-300 ease-out",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "flex items-center justify-center gap-3",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
        }}
      />
      
      {/* Ripple effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 group-hover:h-[300%] group-hover:w-[300%] transition-all duration-500" />
      </div>

      {/* Content */}
      <span className="relative flex items-center gap-3">
        {loading ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : icon ? (
          <span className="transition-transform group-hover:scale-110">{icon}</span>
        ) : null}
        {children}
      </span>
    </button>
  )
}
