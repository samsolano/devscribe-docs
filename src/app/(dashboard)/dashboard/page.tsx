import { Sidebar } from "@/components/dashboard/sidebar"
import { Dashboard } from "@/components/dashboard/dashboard"

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <Dashboard />
    </div>
  )
}
