"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  children: ReactNode
  title: string
  icon: ReactNode
  className?: string
  delay?: number
}

export function StatusCard({ children, title, icon, className, delay = 0 }: StatusCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.classList.add("animate-in")
            }, delay)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/60 backdrop-blur-xl",
        "border border-border/50",
        "p-5 transition-all duration-500",
        "opacity-0 translate-y-8",
        "hover:border-primary/30 hover:shadow-[0_0_40px_oklch(0.65_0.18_180_/_0.1)]",
        className
      )}
    >
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
      
      {/* Glow effect on top */}
      <div 
        className="absolute -top-10 left-1/2 h-20 w-40 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse, oklch(0.65 0.18 180 / 0.3), transparent 70%)"
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )
}

interface DataRowProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  valueColor?: "primary" | "success" | "destructive" | "warning" | "muted"
  compact?: boolean
}

export function DataRow({ label, value, icon, valueColor = "primary", compact = false }: DataRowProps) {
  const colorClasses = {
    primary: "text-primary",
    success: "text-[oklch(0.65_0.2_150)]",
    destructive: "text-destructive",
    warning: "text-[oklch(0.7_0.18_60)]",
    muted: "text-muted-foreground"
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary/80">
        {icon && <span>{icon}</span>}
        <span className={cn("text-lg font-bold", colorClasses[valueColor])}>{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary/80">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className={cn("font-semibold", colorClasses[valueColor])}>{value}</span>
    </div>
  )
}
