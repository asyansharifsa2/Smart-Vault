"use client"

import { useEffect, useRef } from "react"

export function AnimatedGradientBg() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollY = window.scrollY
      const rotation = scrollY * 0.1
      const translateY = scrollY * 0.3
      
      containerRef.current.style.setProperty("--rotation", `${rotation}deg`)
      containerRef.current.style.setProperty("--translate-y", `${translateY}px`)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ 
        "--rotation": "0deg", 
        "--translate-y": "0px" 
      } as React.CSSProperties}
    >
      {/* Main gradient orbs */}
      <div 
        className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full opacity-30 blur-[100px] transition-transform duration-300"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.18 180), transparent 70%)",
          transform: "translateY(calc(var(--translate-y) * -1)) rotate(var(--rotation))"
        }}
      />
      <div 
        className="absolute -right-1/4 top-1/4 h-[500px] w-[500px] rounded-full opacity-25 blur-[100px] transition-transform duration-300"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 150), transparent 70%)",
          transform: "translateY(calc(var(--translate-y) * 0.5)) rotate(calc(var(--rotation) * -1))"
        }}
      />
      <div 
        className="absolute -left-1/4 bottom-0 h-[400px] w-[400px] rounded-full opacity-20 blur-[80px] transition-transform duration-300"
        style={{
          background: "radial-gradient(circle, oklch(0.6 0.15 300), transparent 70%)",
          transform: "translateY(calc(var(--translate-y) * 0.8))"
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.65 0.18 180 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.65 0.18 180 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />
    </div>
  )
}
