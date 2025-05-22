import { cn } from "@/lib/utils"

interface GlowProps {
  className?: string
  variant?: "default" | "top" | "bottom" | "left" | "right"
}

export function Glow({ className, variant = "default" }: GlowProps) {
  const variantClasses = {
    default: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    top: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
    bottom: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
    left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-0 h-[300px] w-[300px] select-none rounded-full bg-white/20 blur-[100px]",
        variantClasses[variant],
        className,
      )}
      aria-hidden="true"
    />
  )
}
