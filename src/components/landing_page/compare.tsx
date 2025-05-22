"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CompareProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function Compare({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: CompareProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width

    // Get clientX from either mouse or touch event
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX

    // Calculate position relative to container
    const x = clientX - containerRect.left
    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100))

    setPosition(newPosition)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleMove)
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchend", handleDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging])

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)} ref={containerRef}>
      {/* Before image (full width) */}
      <div className="w-full">
        <img src={beforeImage || "/placeholder.svg"} alt={beforeLabel} className="w-full h-auto object-cover" />
        {beforeLabel && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 text-sm rounded">{beforeLabel}</div>
        )}
      </div>

      {/* After image (clipped) */}
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={afterImage || "/placeholder.svg"}
          alt={afterLabel}
          className="absolute top-0 left-0 h-full object-cover"
          style={{ width: `${100 / (position / 100)}%` }}
        />
        {afterLabel && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 text-sm rounded">{afterLabel}</div>
        )}
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${position}%` }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5 5L15.5 12L8.5 19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 5L8.5 12L15.5 19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
