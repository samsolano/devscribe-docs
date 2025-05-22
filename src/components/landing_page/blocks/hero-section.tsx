"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  badge?: {
    text: string
    action?: {
      text: string
      href: string
    }
  }
  title: string
  description: string
  actions?: Array<{
    text: string
    href: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "glow"
    icon?: React.ReactNode
  }>
  image?: {
    light: string
    dark: string
    alt: string
  }
  className?: string
}

export function HeroSection({ badge, title, description, actions, image, className }: HeroSectionProps) {
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          {badge && (
            <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
              <span>{badge.text}</span>
              {badge.action && (
                <Link
                  href={badge.action.href}
                  className="ml-1 inline-flex items-center gap-x-1 text-neutral-900 dark:text-neutral-100"
                >
                  {badge.action.text}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-3 w-3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              )}
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">{title}</h1>
            <p className="mx-auto max-w-[700px] text-neutral-500 md:text-xl dark:text-neutral-400">{description}</p>
          </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant={action.variant === "glow" ? "outline" : action.variant}
                  className={cn(
                    action.variant === "glow" &&
                      "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:bg-neutral-100 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
                  )}
                >
                  <Link href={action.href} className="flex items-center gap-2">
                    {action.text}
                    {action.icon}
                  </Link>
                </Button>
              ))}
            </div>
          )}
          {image && (
            <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
              <Image
                src={image.dark || "/placeholder.svg"}
                alt={image.alt}
                width={1920}
                height={1080}
                className="hidden w-full dark:block"
              />
              <Image
                src={image.light || "/placeholder.svg"}
                alt={image.alt}
                width={1920}
                height={1080}
                className="w-full dark:hidden"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
