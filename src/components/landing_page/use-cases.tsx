"use client"

import type React from "react"
import { Badge } from "@/components/landing_page/ui/badge"
import { cn } from "@/lib/utils"
import { useRef } from "react"

export const GlareCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const isPointerInside = useRef(false)
  const refElement = useRef<HTMLDivElement>(null)
  const state = useRef({
    glare: {
      x: 50,
      y: 50,
    },
    background: {
      x: 50,
      y: 50,
    },
    rotate: {
      x: 0,
      y: 0,
    },
  })
  const containerStyle = {
    "--m-x": "50%",
    "--m-y": "50%",
    "--r-x": "0deg",
    "--r-y": "0deg",
    "--bg-x": "50%",
    "--bg-y": "50%",
    "--duration": "300ms",
    "--foil-size": "100%",
    "--opacity": '  "50%',
    "--bg-y": "50%",
    "--duration": "300ms",
    "--foil-size": "100%",
    "--opacity": "0",
    "--radius": "48px",
    "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
  } as any

  const backgroundStyle = {
    "--step": "5%",
    "--foil-svg": `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' strokeWidth='5' strokeMiterlimit='3.86874' strokeLinecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")`,
    "--pattern": "var(--foil-svg) center/100% no-repeat",
    "--rainbow":
      "repeating-linear-gradient( 0deg,rgba(56,182,255,0.5) calc(var(--step) * 1),rgba(56,182,255,0.6) calc(var(--step) * 2),rgba(56,182,255,0.7) calc(var(--step) * 3),rgba(131,255,247,0.8) calc(var(--step) * 4),rgba(56,182,255,0.7) calc(var(--step) * 5),rgba(56,182,255,0.6) calc(var(--step) * 6),rgba(56,182,255,0.5) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
    "--diagonal":
      "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
    "--shade":
      "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
    backgroundBlendMode: "hue, hue, hue, overlay",
  }

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current
      refElement.current?.style.setProperty("--m-x", `${glare.x}%`)
      refElement.current?.style.setProperty("--m-y", `${glare.y}%`)
      refElement.current?.style.setProperty("--r-x", `${rotate.x}deg`)
      refElement.current?.style.setProperty("--r-y", `${rotate.y}deg`)
      refElement.current?.style.setProperty("--bg-x", `${background.x}%`)
      refElement.current?.style.setProperty("--bg-y", `${background.y}%`)
    }
  }
  return (
    <div
      style={containerStyle}
      className="relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-transform w-full [aspect-ratio:17/21]"
      ref={refElement}
      onPointerMove={(event) => {
        const rotateFactor = 0.4
        const rect = event.currentTarget.getBoundingClientRect()
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
        const percentage = {
          x: (100 / rect.width) * position.x,
          y: (100 / rect.height) * position.y,
        }
        const delta = {
          x: percentage.x - 50,
          y: percentage.y - 50,
        }

        const { background, rotate, glare } = state.current
        background.x = 50 + percentage.x / 4 - 12.5
        background.y = 50 + percentage.y / 3 - 16.67
        rotate.x = -(delta.x / 3.5)
        rotate.y = delta.y / 2
        rotate.x *= rotateFactor
        rotate.y *= rotateFactor
        glare.x = percentage.x
        glare.y = percentage.y

        updateStyles()
      }}
      onPointerEnter={() => {
        isPointerInside.current = true
        if (refElement.current) {
          setTimeout(() => {
            if (isPointerInside.current) {
              refElement.current?.style.setProperty("--duration", "0s")
            }
          }, 300)
        }
      }}
      onPointerLeave={() => {
        isPointerInside.current = false
        if (refElement.current) {
          refElement.current.style.removeProperty("--duration")
          refElement.current?.style.setProperty("--r-x", `0deg`)
          refElement.current?.style.setProperty("--r-y", `0deg`)
        }
      }}
    >
      <div className="h-full grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] rounded-[var(--radius)] border border-gray-700/50 hover:[--opacity:0.6] hover:[--duration:200ms] hover:[--easing:linear] hover:filter-none overflow-hidden">
        <div className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clip-path:inset(0_0_0_0_round_var(--radius))]">
          <div className={cn("h-full w-full bg-slate-950", className)}>{children}</div>
        </div>
        <div className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clip-path:inset(0_0_1px_0_round_var(--radius))] opacity-[var(--opacity)] transition-opacity transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)]" />
        <div
          className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-[var(--opacity)] will-change-background transition-opacity [clip-path:inset(0_0_1px_0_round_var(--radius))] [background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] relative after:content-[''] after:grid-area-[inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit] after:bg-[inherit] after:mix-blend-exclusion after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-blend-mode:soft-light,_hue,_hard-light]"
          style={{ ...backgroundStyle }}
        />
      </div>
    </div>
  )
}

export function UseCases() {
  return (
    <section className="overflow-hidden py-16 md:py-32 bg-[#111111] text-gray-300">
      <div className="mx-auto max-w-5xl space-y-8 px-4 md:px-6 lg:px-8 md:space-y-12">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-[#60A5FA] text-white hover:bg-[#60A5FA]/90 mb-4">Developers</Badge>
          <h2 className="text-4xl font-semibold lg:text-5xl text-white">Explore Use Cases</h2>
          <p className="mt-6 text-lg text-gray-400">
            Our docs are designed to be read by any user, regardless of their role or technical expertise.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <GlareCard className="bg-[#111111] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3 text-white">Developers</h3>
              <p className="text-gray-400 text-sm mb-4">
                Docs for technical users who need detailed API references and code examples.
              </p>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#111111] text-white border border-gray-700/50">
                Active
              </span>
            </div>
          </GlareCard>

          <GlareCard className="bg-[#111111] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3 text-white">AI Agents</h3>
              <p className="text-gray-400 text-sm mb-4">
                Docs for agents to understand and interact with your APIs to complete tasks and start using your
                product.
              </p>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#111111] text-white border border-gray-700/50">
                Coming soon
              </span>
            </div>
          </GlareCard>

          <GlareCard className="bg-[#111111] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3 text-white">Managers</h3>
              <p className="text-gray-400 text-sm mb-4">
                Docs for decision makers who need high-level API understanding and business value.
              </p>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#111111] text-white border border-gray-700/50">
                Active
              </span>
            </div>
          </GlareCard>
        </div>
      </div>
    </section>
  )
}
