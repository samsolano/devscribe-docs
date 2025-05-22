"use client"

import '@/styles/globals.css'
import Layout from '@/components/layout/Layout'
import { usePathname } from 'next/navigation'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname();
  const showSidebar = pathname !== '/edit';


  return (
    <html lang="en">
      <body>
        <Layout>
        <div className={`
            mx-auto p-6 rounded-xl shadow-lg bg-neutral-900 border border-devscribe-border
            ${showSidebar ? 'max-w-7xl' : 'w-full'}
          `}>
            {children}
          </div>
        </Layout>
      </body>
    </html>
  )
}
