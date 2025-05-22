"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  gradient?: "blue" | "purple" | "cyan" | "pink" | "red" | "orange" | "green" | "rainbow"
  animate?: boolean
  children: React.ReactNode
}

export function GradientText({
  as: Component = "h1",
  gradient = "rainbow",
  animate = true,
  children,
  className,
  ...props
}: GradientTextProps) {
  const gradientMap = {
    blue: "from-blue-600 via-blue-400 to-blue-600",
    purple: "from-purple-600 via-purple-400 to-purple-600",
    cyan: "from-cyan-600 via-cyan-400 to-cyan-600",
    pink: "from-pink-600 via-pink-400 to-pink-600",
    red: "from-red-600 via-red-400 to-red-600",
    orange: "from-orange-600 via-orange-400 to-orange-600",
    green: "from-green-600 via-green-400 to-green-600",
    rainbow: "from-blue-600 via-purple-500 via-red-500 to-amber-500",
  }

  return (
    <Component
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradientMap[gradient],
        animate && "animate-text-gradient bg-[length:400%_400%]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
