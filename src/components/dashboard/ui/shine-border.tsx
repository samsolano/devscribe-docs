"use client"

import { cn } from "@/lib/utils"
import type React from "react"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * ShineBorder component creates an animated glowing border effect around its children
 */
export function ShineBorder({
  borderRadius = 12,
  borderWidth = 3,
  duration = 10,
  color = "#3b82f6",
  className,
  children,
}: ShineBorderProps) {
  // Convert color array to CSS gradient string
  const gradientColors = Array.isArray(color) ? color.join(", ") : color

  return (
    <div
      className={cn("relative", className)}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        background: `linear-gradient(90deg, ${gradientColors})`,
        backgroundSize: "300% 300%",
        animation: `shine-border ${duration}s linear infinite`,
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          borderRadius: `${borderRadius}px`,
          background: `linear-gradient(90deg, ${gradientColors})`,
          backgroundSize: "300% 300%",
          filter: "blur(8px)",
          opacity: 0.7,
          animation: `shine-border ${duration}s linear infinite`,
        }}
      />
      <div
        className="relative z-10 w-full h-full bg-background overflow-hidden"
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
