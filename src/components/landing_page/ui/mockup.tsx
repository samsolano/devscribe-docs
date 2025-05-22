import { cn } from "@/lib/utils"
import type React from "react"

interface MockupFrameProps {
  children: React.ReactNode
  className?: string
  size?: "small" | "medium" | "large"
}

export function MockupFrame({ children, className, size = "medium" }: MockupFrameProps) {
  const sizeClasses = {
    small: "max-w-4xl",
    medium: "max-w-5xl",
    large: "max-w-[90vw] md:max-w-6xl",
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-lg border border-gray-700/50 bg-[#1a1a1a] shadow-xl",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface MockupProps {
  children: React.ReactNode
  className?: string
  type?: "browser" | "phone" | "responsive"
}

export function Mockup({ children, className, type = "browser" }: MockupProps) {
  if (type === "browser") {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="flex items-center gap-1.5 border-b border-gray-700/50 bg-[#1a1a1a]/30 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-500/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-500/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-500/20" />
          <div className="ml-2 h-5 flex-1 rounded-full bg-gray-500/10" />
        </div>
        <div className="bg-[#1a1a1a]">{children}</div>
      </div>
    )
  }

  if (type === "phone") {
    return (
      <div className={cn("overflow-hidden rounded-[32px] border-8 border-gray-700/50", className)}>
        <div className="bg-[#1a1a1a]">{children}</div>
      </div>
    )
  }

  // Responsive (default)
  return <div className={cn("bg-[#1a1a1a]", className)}>{children}</div>
}
