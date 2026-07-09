"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface AlertBannerProps {
  isVisible: boolean
  message: string
}

export function AlertBanner({ isVisible, message }: AlertBannerProps) {
  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-4",
        "bg-gradient-to-r from-destructive to-[oklch(0.65_0.18_25)]",
        "text-destructive-foreground font-bold",
        "animate-pulse-alert"
      )}
    >
      <style jsx>{`
        @keyframes pulseAlert {
          0%, 100% { 
            box-shadow: 0 0 15px oklch(0.55 0.2 25 / 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px oklch(0.55 0.2 25 / 0.8);
            transform: scale(1.02);
          }
        }
        .animate-pulse-alert {
          animation: pulseAlert 1.5s infinite;
        }
      `}</style>
      
      {/* Animated warning stripes */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
          animation: "moveStripes 1s linear infinite"
        }}
      />
      
      <style jsx>{`
        @keyframes moveStripes {
          0% { background-position: 0 0; }
          100% { background-position: 28px 0; }
        }
      `}</style>
      
      <span className="relative flex items-center justify-center gap-3">
        <AlertTriangle className="h-5 w-5 animate-pulse" />
        <span>{message}</span>
        <AlertTriangle className="h-5 w-5 animate-pulse" />
      </span>
    </div>
  )
}
