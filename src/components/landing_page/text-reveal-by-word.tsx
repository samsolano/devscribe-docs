"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"

interface TextRevealByWordProps {
  text: string
  className?: string
}

const TextRevealByWord = ({ text, className }: TextRevealByWordProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "center center"],
  })

  const words = text.split(" ")

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[70vh] bg-[#111111]", className)}>
      <div
        className={"sticky top-0 mx-auto flex h-screen items-center justify-center bg-transparent px-4 md:px-6 lg:px-8"}
      >
        <div className="flex max-w-5xl flex-wrap justify-center">
          {words.map((word, i) => {
            // Compress the animation range even more for faster reveal
            const start = (i / words.length) * 0.3
            const end = start + 0.3 / words.length

            return <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]} word={word} />
          })}
        </div>
      </div>
    </div>
  )
}

interface WordProps {
  progress: any
  range: [number, number]
  word: string
}

const Word = ({ progress, range, word }: WordProps) => {
  const opacity = useTransform(progress, range, [0, 1])
  const filter = useTransform(progress, range, ["blur(4px) brightness(1.3)", "blur(0px) brightness(1)"])
  const y = useTransform(progress, range, [15, 0]) // Further reduced y-movement
  const scale = useTransform(progress, range, [1.05, 1]) // Further reduced scale change

  return (
    <motion.span
      style={{ opacity, filter, y, scale }}
      className="relative mx-1.5 mb-3 inline-block text-3xl font-bold text-white md:text-4xl lg:text-5xl"
    >
      {word}
    </motion.span>
  )
}

export { TextRevealByWord }
