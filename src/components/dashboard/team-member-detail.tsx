"use client"
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { TeamMember, TeamMemberRole } from "@/components/team-member-card"

interface TeamMemberDetailProps {
  member: TeamMember & {
    phone?: string
    location?: string
    joinDate?: string
    department?: string
    bio?: string
    projects?: { id: string; name: string }[]
  }
  onBack: () => void
}

export function TeamMemberDetail({ member, onBack }: TeamMemberDetailProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Team Member Profile</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center p-6 border rounded-md bg-card">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background mb-4">
              {member.avatar ? (
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-medium">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <Badge variant={getRoleBadgeVariant(member.role)} className="mt-2 capitalize">
              {member.role}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">{member.department || "No department"}</div>

            <Separator className="my-4" />

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                  {member.email}
                </a>
              </div>

              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
              )}

              {member.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{member.location}</span>
                </div>
              )}

              {member.joinDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {member.joinDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-2/3 space-y-6">
          <div className="border rounded-md bg-card p-6">
            <h3 className="text-lg font-medium mb-3">About</h3>
            <p className="text-sm text-muted-foreground">{member.bio || "No bio available."}</p>
          </div>

          <div className="border rounded-md bg-card p-6">
            <h3 className="text-lg font-medium mb-3">Projects</h3>
            {member.projects && member.projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {member.projects.map((project) => (
                  <div key={project.id} className="p-3 border rounded-md bg-background">
                    <div className="font-medium">{project.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects assigned.</p>
            )}
          </div>

          <div className="border rounded-md bg-card p-6">
            <h3 className="text-lg font-medium mb-3">Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Updated profile information</div>
                  <div className="text-xs text-muted-foreground">2 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Role changed to {member.role}</div>
                  <div className="text-xs text-muted-foreground">1 week ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
