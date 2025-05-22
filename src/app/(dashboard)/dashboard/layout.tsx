import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/dashboard/theme-provider"
import { Toaster } from "@/components/dashboard/toaster"

export const metadata: Metadata = {
  title: "Documentation Portal",
  description: "Team documentation portal dashboard",
  generator: 'v0.dev'
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
