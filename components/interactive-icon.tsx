"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InteractiveIconProps {
  children: ReactNode
  className?: string
  glowColor?: string
  size?: "sm" | "md" | "lg"
}

export function InteractiveIcon({ 
  children, 
  className, 
  glowColor = "oklch(0.65 0.18 180)",
  size = "md" 
}: InteractiveIconProps) {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const icon = iconRef.current
    if (!icon) return

    let isInView = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting
          if (isInView) {
            icon.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(icon)

    const handleScroll = () => {
      if (!isInView) return
      const rect = icon.getBoundingClientRect()
      const centerY = window.innerHeight / 2
      const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - centerY)
      const maxDistance = window.innerHeight / 2
      const scale = 1 + (1 - distanceFromCenter / maxDistance) * 0.1
      
      icon.style.transform = `scale(${scale})`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  }

  return (
    <div
      ref={iconRef}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl",
        "bg-secondary/50 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:bg-secondary/80",
        "active:scale-95",
        "cursor-pointer select-none",
        "opacity-0 translate-y-4",
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow: `0 0 0 1px ${glowColor}20, 0 0 20px ${glowColor}00`,
        transition: "all 0.3s ease-out, box-shadow 0.3s ease-out, transform 0.1s ease-out"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}40, 0 0 30px ${glowColor}30`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}20, 0 0 20px ${glowColor}00`
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${glowColor}60, 0 0 40px ${glowColor}40`
        e.currentTarget.style.transform = "scale(1.15)"
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}20, 0 0 20px ${glowColor}00`
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
      {children}
    </div>
  )
}
