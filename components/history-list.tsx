"use client"

import { cn } from "@/lib/utils"
import { Wifi, AlertTriangle, CheckCircle2, ScrollText } from "lucide-react"

export interface HistoryItem {
  time: string
  msg: string
  type: "info" | "alert" | "safe"
}

interface HistoryListProps {
  items: HistoryItem[]
}

export function HistoryList({ items }: HistoryListProps) {
  const typeStyles = {
    info: "border-l-primary bg-primary/5",
    alert: "border-l-destructive bg-destructive/5",
    safe: "border-l-[oklch(0.55_0.22_150)] bg-[oklch(0.55_0.22_150_/_0.05)]"
  }

  const typeIcons = {
    info: Wifi,
    alert: AlertTriangle,
    safe: CheckCircle2
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <ScrollText className="mb-2 h-8 w-8 opacity-40" />
        <span className="text-sm">Belum ada riwayat</span>
      </div>
    )
  }

  return (
    <div className="max-h-40 space-y-2 overflow-y-auto pr-2 scrollbar-thin">
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: oklch(0.3 0.02 270);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: oklch(0.4 0.02 270);
        }
      `}</style>
      
      {items.map((item, index) => {
        const Icon = typeIcons[item.type]
        return (
          <div
            key={`${item.time}-${index}`}
            className={cn(
              "flex items-center justify-between rounded-lg border-l-4 p-3 transition-all",
              "hover:translate-x-1",
              typeStyles[item.type]
            )}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Icon className="h-4 w-4" />
              {item.msg}
            </span>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        )
      })}
    </div>
  )
}
