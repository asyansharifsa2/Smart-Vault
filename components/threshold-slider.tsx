"use client"

import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface ThresholdSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
  label: string
  icon?: ReactNode
}

export function ThresholdSlider({
  value,
  onChange,
  disabled = false,
  min = 10,
  max = 200,
  label,
  icon
}: ThresholdSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon && <span className="text-primary">{icon}</span>}
          {label}
        </label>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {value}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_oklch(0.65_0.18_180_/_0.5)]",
            "[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
          )}
          style={{
            background: `linear-gradient(to right, oklch(0.65 0.18 180) 0%, oklch(0.65 0.18 180) ${percentage}%, oklch(0.2 0.015 270) ${percentage}%, oklch(0.2 0.015 270) 100%)`
          }}
        />
      </div>
    </div>
  )
}
