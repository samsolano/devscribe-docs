"use client"

import { useState } from "react"
import { MoreHorizontal, Mail, Trash2, UserPlus, Shield, ShieldAlert, ShieldCheck, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type TeamMemberRole = "owner" | "admin" | "editor" | "viewer"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamMemberRole
  avatar: string
  status: "active" | "invited" | "inactive"
  lastActive?: string
}

interface TeamMemberCardProps {
  member: TeamMember
  currentUserRole: TeamMemberRole
  currentUserId: string
  onRemove?: (id: string) => void
  onChangeRole?: (id: string, role: TeamMemberRole) => void
  onResendInvite?: (id: string) => void
}

export function TeamMemberCard({
  member,
  currentUserRole,
  currentUserId,
  onRemove,
  onChangeRole,
  onResendInvite,
}: TeamMemberCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isCurrentUser = member.id === currentUserId
  const canManageUser = (currentUserRole === "owner" || currentUserRole === "admin") && !isCurrentUser

  // Determine if current user can change this member's role
  const canChangeRole = (targetRole: TeamMemberRole) => {
    if (!canManageUser) return false
    if (currentUserRole !== "owner" && (member.role === "owner" || targetRole === "owner")) return false
    return true
  }

  const getRoleBadgeVariant = (role: TeamMemberRole) => {
    switch (role) {
      case "owner":
        return "outline"
      case "admin":
        return "secondary"
      case "editor":
        return "default"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRoleIcon = (role: TeamMemberRole) => {
    switch (role) {
      case "owner":
        return <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
      case "admin":
        return <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
      case "editor":
        return <UserCog className="h-3.5 w-3.5 mr-1.5" />
      case "viewer":
        return <Shield className="h-3.5 w-3.5 mr-1.5" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-md bg-card">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full overflow-hidden border bg-muted">
            {member.avatar ? (
              <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>
            )}
          </div>
          {member.status === "active" && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div>
          <div className="font-medium flex items-center">
            {member.name}
            {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
          </div>
          <div className="text-sm text-muted-foreground">{member.email}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block text-xs text-muted-foreground">
          {member.status === "active" && member.lastActive
            ? `Last active ${member.lastActive}`
            : member.status === "invited"
              ? "Invitation sent"
              : "Inactive"}
        </div>

        <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center">
          {getRoleIcon(member.role)}
          <span className="capitalize">{member.role}</span>
        </Badge>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => window.open(`mailto:${member.email}`, "_blank")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>

            {member.status === "invited" && onResendInvite && (
              <DropdownMenuItem className="flex items-center" onClick={() => onResendInvite(member.id)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Resend Invite
              </DropdownMenuItem>
            )}

            {canManageUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={cn("flex items-center", !canChangeRole("admin") && "text-muted-foreground")}
                  disabled={!canChangeRole("admin")}
                  onClick={() => onChangeRole?.(member.id, "admin")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Make Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn("flex items-center", !canChangeRole("editor") && "text-muted-foreground")}
                  disabled={!canChangeRole("editor")}
                  onClick={() => onChangeRole?.(member.id, "editor")}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Make Editor
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn("flex items-center", !canChangeRole("viewer") && "text-muted-foreground")}
                  disabled={!canChangeRole("viewer")}
                  onClick={() => onChangeRole?.(member.id, "viewer")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Make Viewer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center text-destructive focus:text-destructive"
                  onClick={() => onRemove?.(member.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
