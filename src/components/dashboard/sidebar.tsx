"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FileText, Settings, FileCode, HelpCircle, Moon, LogOut, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/dashboard/ui/button"
import { InviteMembersDialog } from "@/components/dashboard/invite-members-dialog"
import { AvatarGroup } from "@/components/dashboard/avatar-group"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import {
  InfoCard,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardContent,
  InfoCardMedia,
  InfoCardFooter,
  InfoCardAction,
} from "@/components/dashboard/ui/info-card"

// Create a context to share the team name across components
export const TeamNameContext = createContext<{
  teamName: string
  setTeamName: (name: string) => void
}>({
  teamName: "TEAM",
  setTeamName: () => {},
})

export const useTeamName = () => useContext(TeamNameContext)

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}

// Logout API call as a separate function
async function logoutUser() {
  try {
    await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const [teamName, setTeamName] = useState("TEAM")
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(teamName)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEditStart = () => {
    setIsEditing(true)
    setEditValue(teamName)
  }

  const handleEditSave = () => {
    setIsSaving(true)
    if (editValue.trim()) {
      setTeamName(editValue.trim())
    }
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleEditCancel = () => {
    if (!isSaving) {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave()
    } else if (e.key === "Escape") {
      handleEditCancel()
    }
  }

  // Updated team members data with profile-like images and active status
  const teamMembers = [
    {
      // src: "/young-man-headshot.png",
      alt: "Team Member 1",
      label: "Alex Johnson",
      active: true,
    },
    {
      // src: "/profile-image-4.png",
      alt: "Team Member 3",
      label: "Jordan Lee",
    },
    {
      // src: "/red-hair-headshot.png",
      alt: "Team Member 4",
      label: "Casey Morgan",
    },
    {
      // src: "/professional-headshot-dark-hair-woman.png",
      alt: "Team Member 5",
      label: "Riley Smith",
      active: true,
    },
    {
      // src: "/bearded-man-headshot.png",
      alt: "Team Member 6",
      label: "Taylor Wilson",
    },
  ]

  return (
    <TeamNameContext.Provider value={{ teamName, setTeamName }}>
      <div className="flex h-full w-[200px] flex-col bg-black text-white">
        <div className="flex h-14 items-center border-b border-border/40 px-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-6 w-6 mr-2">
              {/* TODO: add source back to image */}
              <Image src="/placeholder.png" alt="Logo" fill className="object-contain" priority /> 
            </div>
            {isEditing ? (
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(handleEditCancel, 100)}
                  className="bg-transparent border-b border-white/30 outline-none text-white font-semibold w-24 px-0"
                  maxLength={20}
                />
                <div className="flex ml-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white hover:text-white/80 hover:bg-white/10"
                    onClick={handleEditSave}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white hover:text-white/80 hover:bg-white/10"
                    onClick={handleEditCancel}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <span className="font-semibold cursor-pointer hover:text-white/80" onClick={handleEditStart}>
                {teamName}
              </span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <NavItem icon={FileText} label="Overview" href="/" active={pathname === "/"} />
            <NavItem icon={FileCode} label="Editor" href="/editor" active={pathname === "/editor"} />
            <NavItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} />
          </nav>
        </div>

        <div className="mt-auto border-t border-border/40 px-2 py-2">
          <div className="mb-3 px-1">
            <InfoCard
              className="bg-black border-border/40 text-white"
              storageKey="sidebar-info-card"
              dismissType="forever"
            >
              <InfoCardContent>
                <InfoCardTitle className="text-white">Watch Tutorial</InfoCardTitle>
                <InfoCardDescription className="text-muted-foreground">
                  Watch this video to help jumpstart your documentation platform.
                </InfoCardDescription>
                <InfoCardMedia
                  media={[
                    {
                      src: "/placeholder.png",  // TODO: add back later
                      alt: "Collaborative editing feature",
                    },
                  ]}
                  shrinkHeight={60}
                  expandHeight={120}
                />
                <InfoCardFooter className="mt-2 pt-2 border-t border-border/40">
                  <InfoCardAction>
                    <Button variant="link" className="h-auto p-0 text-xs text-sky-400">
                      Watch video
                    </Button>
                  </InfoCardAction>
                </InfoCardFooter>
              </InfoCardContent>
            </InfoCard>
          </div>

          <nav className="grid gap-1">
            <NavItem icon={FileText} label="Documentation" href="#" />
            <InviteMembersDialog />
            <NavItem icon={HelpCircle} label="Support" href="/support" />
          </nav>

          <div className="mt-4 flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:text-white/80 hover:bg-white/10 relative group"
                onClick={logoutUser}
              >
                <LogOut className="h-4 w-4" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-9 px-3 py-1.5 rounded-md bg-card text-foreground border border-border shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20 whitespace-nowrap" style={{ transitionDelay: '500ms' }}>
                  Logout
                </span>
              </Button>
            </div>
            <AvatarGroup avatars={teamMembers} maxVisible={2} size={32} overlap={10} />
          </div>
        </div>
      </div>
    </TeamNameContext.Provider>
  )
}
