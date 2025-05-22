import type React from "react"
import { Inter } from "next/font/google"
import "@/styles/landing_globals.css"
import HeroSection from "@/components/landing_page/hero-section"
import { ConditionalFooter } from "@/components/landing_page/conditional-footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#111111]`}>
        <HeroSection isNavOnly={true} />
        {children}
        {/* <ConditionalFooter /> */}
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
