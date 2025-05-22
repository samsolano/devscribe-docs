"use client"

import { useState, useMemo } from "react"
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TeamMember, TeamMemberCard, type TeamMemberRole } from "@/components/team-member-card"
import { InviteMembersDialog } from "@/components/invite-members-dialog"
import { useToast } from "@/components/ui/use-toast"

interface TeamMembersListProps {
  members: TeamMember[]
  currentUserId: string
  currentUserRole: TeamMemberRole
}

export function TeamMembersList({ members, currentUserId, currentUserRole }: TeamMembersListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const { toast } = useToast()

  const itemsPerPage = 5

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase())

        // Role filter
        const matchesRole = roleFilter === "all" || member.role === roleFilter

        // Status filter
        const matchesStatus = statusFilter === "all" || member.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
      })
      .sort((a, b) => {
        // Sort by role importance first
        const roleOrder = { owner: 0, admin: 1, editor: 2, viewer: 3 }
        if (roleOrder[a.role] !== roleOrder[b.role]) {
          return roleOrder[a.role] - roleOrder[b.role]
        }

        // Then sort by active status
        if (a.status !== b.status) {
          return a.status === "active" ? -1 : 1
        }

        // Then alphabetically by name
        return a.name.localeCompare(b.name)
      })
  }, [members, searchQuery, roleFilter, statusFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

  const handleRemoveMember = (id: string) => {
    // In a real app, this would call an API
    toast({
      title: "User removed",
      description: "The team member has been removed successfully.",
    })
  }

  const handleChangeRole = (id: string, role: TeamMemberRole) => {
    // In a real app, this would call an API
    toast({
      title: "Role updated",
      description: `The team member's role has been updated to ${role}.`,
    })
  }

  const handleResendInvite = (id: string) => {
    // In a real app, this would call an API
    toast({
      title: "Invitation resent",
      description: "The invitation has been resent successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {(currentUserRole === "owner" || currentUserRole === "admin") && (
            <InviteMembersDialog>
              <Button className="whitespace-nowrap">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </InviteMembersDialog>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {paginatedMembers.length > 0 ? (
          paginatedMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onRemove={handleRemoveMember}
              onChangeRole={handleChangeRole}
              onResendInvite={handleResendInvite}
            />
          ))
        ) : (
          <div className="text-center py-8 border rounded-md bg-card">
            <p className="text-muted-foreground">No team members found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
