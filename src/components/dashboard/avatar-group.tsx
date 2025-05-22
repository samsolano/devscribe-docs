"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface AvatarGroupProps {
  avatars: {
    src: string
    alt?: string
    label?: string
    new?: boolean
    status?: "active" | "invited" | "inactive"
    active?: boolean
  }[]
  maxVisible?: number
  size?: number
  overlap?: number
}

const AvatarGroup = ({ avatars, maxVisible = 5, size = 40, overlap = 14 }: AvatarGroupProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const visibleAvatars = avatars.slice(0, maxVisible)
  const extraCount =
    avatars.filter((avatar) => avatar.status !== "inactive" && avatar.status !== "invited").length - maxVisible

  return (
    <div className="flex items-center">
      <div className="flex -space-x-4">
        {visibleAvatars
          .filter((avatar) => avatar.status !== "inactive" && avatar.status !== "invited")
          .map((avatar, idx) => {
            const isHovered = hoveredIdx === idx
            return (
              <div
                key={idx}
                className="border-4 border-background rounded-full bg-background transition-all duration-300 relative"
                style={{
                  width: size,
                  height: size,
                  zIndex: isHovered ? 100 : visibleAvatars.length - idx,
                  marginLeft: -overlap,
                  position: "relative",
                  transition:
                    "margin-left 0.3s cubic-bezier(0.4,0,0.2,1), z-index 0s, box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transform: isHovered ? "translateY(-10px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <img
                  src={avatar.src || "/placeholder.svg"}
                  alt={avatar.alt || `Avatar ${idx + 1}`}
                  width={size}
                  height={size}
                  className="rounded-full object-cover"
                  draggable={false}
                />
                {avatar.active && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background z-10" />
                )}
                <AnimatePresence>
                  {isHovered && avatar.label && (
                    <motion.div
                      key="tooltip"
                      initial={{
                        x: "-50%",
                        y: 10,
                        opacity: 0,
                        scale: 0.7,
                      }}
                      animate={{
                        x: "-50%",
                        y: 0,
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        x: "-50%",
                        y: 10,
                        opacity: 0,
                        scale: 0.7,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 24,
                      }}
                      className="absolute z-50 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg whitespace-nowrap pointer-events-none font-semibold"
                      style={{
                        top: -size * 0.7,
                        left: "50%",
                      }}
                    >
                      {avatar.label} {avatar.active && <span className="text-green-400 ml-1">• Active</span>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        {extraCount > 0 && (
          <div
            className="border-4 border-background rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center transition-all duration-300 relative"
            style={{
              width: size,
              height: size,
              zIndex: 0,
              marginLeft: -overlap,
              fontSize: size * 0.32,
              transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  )
}

export { AvatarGroup }
