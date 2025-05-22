"use client"

import type React from "react"

import { useState } from "react"
import { Check, Copy, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/dashboard/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/dashboard/ui/form"
import { Input } from "@/components/dashboard/ui/input"
import { Textarea } from "@/components/dashboard/ui/textarea"
import { useToast } from "@/components/dashboard/ui/use-toast"
import { Badge } from "@/components/dashboard/ui/badge"
// import { inviteMembers } from "@/actions/invite-members"

const formSchema = z.object({
  emails: z.string().min(1, {
    message: "Please enter at least one email address.",
  }),
  message: z.string().optional(),
})

export function InviteMembersDialog() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailList, setEmailList] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: "",
      message: "I'd like to invite you to collaborate on our documentation portal.",
    },
  })

  const addEmail = () => {
    if (currentEmail && !emailList.includes(currentEmail) && isValidEmail(currentEmail)) {
      setEmailList([...emailList, currentEmail])
      setCurrentEmail("")
    }
  }

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter((e) => e !== email))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addEmail()
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault()
      addEmail()
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (emailList.length === 0) {
      form.setError("emails", {
        type: "manual",
        message: "Please add at least one email address.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // In a real app, this would call a server action to send invitations
      // For demo purposes, we'll simulate a successful invitation
      // await inviteMembers(emailList, values.message || "")

      // Generate a fake invite link
      const teamName = "team"
      setInviteLink(`https://${teamName}.docs.com/invite/abc123xyz`)

      toast({
        title: "Invitations sent successfully!",
        description: `Invitations have been sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`,
      })

      // Reset form but keep dialog open to show the invite link
      form.reset()
      setEmailList([])
    } catch (error) {
      toast({
        title: "Failed to send invitations",
        description: "There was an error sending the invitations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const closeDialog = () => {
    setOpen(false)
    setInviteLink("")
    form.reset()
    setEmailList([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-primary w-full">
          <Plus className="h-4 w-4" />
          <span>Invite Members</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
        style={{
          animation: "none",
          transform: "translate(-50%, -50%)",
          opacity: 1,
        }}
      >
        <DialogHeader>
          <DialogTitle>Invite team members</DialogTitle>
          <DialogDescription>Invite team members to collaborate on your documentation portal.</DialogDescription>
        </DialogHeader>
        {!inviteLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email addresses</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5 p-2 border rounded-md min-h-10">
                          {emailList.map((email) => (
                            <Badge key={email} variant="secondary" className="px-2 py-1">
                              {email}
                              <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          <Input
                            placeholder="Enter email addresses..."
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={addEmail}
                            className="flex-1 min-w-[150px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Press Enter, comma, or space to add multiple emails
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal message (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a personal message to your invitation..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This message will be included in the invitation email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Invitations"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="text-sm font-medium mb-2">Share this invite link</div>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="bg-background" />
                <Button size="sm" variant="outline" onClick={copyInviteLink}>
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can join your team. The link will expire in 7 days.
            </p>
            <DialogFooter>
              <Button onClick={closeDialog}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
