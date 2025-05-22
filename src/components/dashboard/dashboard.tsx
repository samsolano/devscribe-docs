"use client"

import type React from "react"

import { ExternalLink, CheckCircle, Circle, GitBranch, Github, Clock } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/ui/table"
import { useState, useRef, useEffect, useContext } from "react"
import { TeamNameContext } from "./sidebar"

interface ActivityItem {
  id: string
  title: string
  date: string
  status: "Successful" | "Completed" | "Failed" | "Pending"
}

const activityItems: ActivityItem[] = [
  {
    id: "1",
    title: "Manual Update",
    date: "Apr 15, 2:10 PM",
    status: "Successful",
  },
  {
    id: "2",
    title: "New API Doc",
    date: "Apr 14, 11:45 AM",
    status: "Completed",
  },
]

// Custom editable URL badge component
function EditableUrlBadge() {
  const [isEditing, setIsEditing] = useState(false)
  const [teamName, setTeamName] = useState("team")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
      // Adjust input width based on content
      adjustInputWidth()
    }
  }, [isEditing])

  // Function to adjust input width based on content
  const adjustInputWidth = () => {
    if (inputRef.current) {
      // Create a temporary span to measure text width
      const span = document.createElement("span")
      span.style.visibility = "hidden"
      span.style.position = "absolute"
      span.style.fontSize = window.getComputedStyle(inputRef.current).fontSize
      span.style.fontFamily = window.getComputedStyle(inputRef.current).fontFamily
      span.style.padding = "0"
      span.innerText = inputRef.current.value || "team"

      document.body.appendChild(span)
      const width = span.offsetWidth
      document.body.removeChild(span)

      // Set input width with some padding
      inputRef.current.style.width = `${Math.max(width + 10, 40)}px`
    }
  }

  // Mock function to check URL availability
  const checkAvailability = (name: string) => {
    // For demo purposes: URLs with length > 3 are "available" except "taken"
    if (name === "taken") return false
    return name.length > 3
  }

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setIsAvailable(null) // Reset availability when not editing
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTeamName(value)
    // Check availability as user types
    setIsAvailable(checkAvailability(value))
    // Adjust input width as user types
    setTimeout(adjustInputWidth, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      setIsAvailable(null) // Reset availability when not editing
    }
  }

  return (
    <Badge
      variant="outline"
      className="cursor-pointer flex items-center overflow-visible"
      onClick={!isEditing ? handleClick : undefined}
    >
      {isEditing && isAvailable !== null && (
        <>
          {isAvailable ? (
            <CheckCircle className="h-3 w-3 text-sky-400 mr-1 flex-shrink-0" />
          ) : (
            <Circle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
          )}
        </>
      )}
      <span className="flex-shrink-0">https://</span>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={teamName}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none min-w-[40px] text-xs mx-0 px-0"
          style={{ width: `${Math.max(teamName.length * 8, 40)}px` }}
          autoFocus
        />
      ) : (
        <span>{teamName}</span>
      )}
      <span className="flex-shrink-0">/docs</span>
    </Badge>
  )
}

// Update the Dashboard component to ensure it takes the full width
export function Dashboard() {
  const { teamName } = useContext(TeamNameContext)
  const firstName = "Alex" // User's first name

  // Determine greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours()
    return currentHour >= 12 ? "Good evening," : "Good morning,"
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex h-full flex-col">
        <header className="flex flex-col space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                {getGreeting()} {firstName}
              </h1>
              <p className="text-muted-foreground">Welcome back to your documentation portal</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 bg-sky-950 text-sky-400">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse relative">
                    <span className="absolute inset-0 rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                  </span>
                  Live
                </Badge>
                <EditableUrlBadge />
              </div>
              <Button className="gap-2">
                Go to your docs
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="my-6 rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <div className="flex items-center">
                <span className="text-sm font-medium">Documentation Preview</span>
              </div>
            </div>
            <div className="p-4 bg-card">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <div className="relative h-full w-full rounded-md overflow-hidden border border-border/50">
                    <div className="p-2">
                      <div className="w-full aspect-video bg-muted/30 rounded-md mb-3 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Documentation Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-2/3 border-l pl-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Last Update:</span>
                    <span>May 17, 2023 - 10:45 AM</span>
                  </div>

                  {/* Repository information */}
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Repository:</span> team/documentation
                    </div>
                  </div>

                  {/* Branch information */}
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Branch:</span> main (production)
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="text-xs bg-sky-950/10 text-sky-400 border-sky-400/20">
                      Latest
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-muted border-muted-foreground/20">
                      v2.1.0
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Activity history</h2>
            </div>
            <p className="text-sm text-muted-foreground">Showing history of updates made on your docs</p>
          </div>
        </header>

        <main className="flex-1 p-6 pt-0">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityItems.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {item.status === "Successful" ? (
                          <CheckCircle className="h-4 w-4 text-sky-400" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "Successful" ? "success" : "default"}
                        className={item.status === "Successful" ? "bg-sky-950 text-sky-400" : ""}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
