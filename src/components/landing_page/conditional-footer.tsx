"use client"

import { usePathname } from "next/navigation"
import { Footer2 } from "./footer2"

export function ConditionalFooter() {
  const pathname = usePathname()

  // Don't render the footer on the signup page or any dashboard routes
  if (pathname === "/signup" || pathname.startsWith("/dashboard")) {
    return null
  }

  return <Footer2 />
}
