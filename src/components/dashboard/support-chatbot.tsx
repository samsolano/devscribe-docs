"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, X, Minimize2, Maximize2, User, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShineBorder } from "@/components/ui/shine-border"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

type SupportChatbotProps = {
  children?: React.ReactNode
  userProfileImage?: string | null
}

export default function SupportChatbot({ children, userProfileImage }: SupportChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! 👋 I'm your documentation assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [showScrollLeft, setShowScrollLeft] = useState(false)
  const [showScrollRight, setShowScrollRight] = useState(false)
  const suggestedQuestions = [
    "How do I create a new document?",
    "How do I invite team members?",
    "Where can I find my account settings?",
    "How do I manage API keys?",
    "What keyboard shortcuts are available?",
    "How can I export my documentation?",
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized, messages])

  // Check if we need to show scroll indicators
  useEffect(() => {
    if (!suggestionsRef.current) return

    const checkScroll = () => {
      const el = suggestionsRef.current
      if (!el) return

      setShowScrollLeft(el.scrollLeft > 0)
      setShowScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5) // 5px buffer
    }

    // Initial check
    checkScroll()

    // Add event listener
    suggestionsRef.current.addEventListener("scroll", checkScroll)

    // Check after content might have changed
    const observer = new ResizeObserver(checkScroll)
    observer.observe(suggestionsRef.current)

    return () => {
      suggestionsRef.current?.removeEventListener("scroll", checkScroll)
      if (suggestionsRef.current) observer.unobserve(suggestionsRef.current)
    }
  }, [isOpen, isMinimized])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(
      () => {
        const response = generateResponse(input)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  // Simple response generation based on keywords
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
      return "Hello! How can I assist you with your documentation today?"
    }

    if (lowerQuery.includes("document") && (lowerQuery.includes("create") || lowerQuery.includes("new"))) {
      return "To create a new document, go to the Editor page and click the 'Create Document' button in the top right corner."
    }

    if (lowerQuery.includes("folder")) {
      return "You can create and manage folders in the Editor page. Look for the folder structure on the left side and use the '+' button to create new folders."
    }

    if (lowerQuery.includes("invite") || lowerQuery.includes("team") || lowerQuery.includes("member")) {
      return "You can invite team members by clicking on 'Invite Members' in the sidebar. You can send email invitations or share an invite link."
    }

    if (lowerQuery.includes("settings") || lowerQuery.includes("account")) {
      return "To access your account settings, navigate to the Settings page where you can update your profile, manage API keys, and customize your preferences."
    }

    if (lowerQuery.includes("api") || lowerQuery.includes("key")) {
      return "API keys can be managed in the Settings page under the 'API Keys' tab. You can generate new keys, rotate existing ones, or revoke them as needed."
    }

    if (lowerQuery.includes("help") || lowerQuery.includes("support")) {
      return "I'm here to help! You can also reach our support team via email at support@team.com or by phone at +1 (555) 123-4567."
    }

    if (lowerQuery.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?"
    }

    if (lowerQuery.includes("keyboard") || lowerQuery.includes("shortcut")) {
      return "We support several keyboard shortcuts: Ctrl+S to save, Ctrl+F to search, Ctrl+N for a new document, and Ctrl+/ to open the command palette."
    }

    if (lowerQuery.includes("export")) {
      return "You can export your documentation by going to the document settings menu and selecting 'Export'. We support PDF, HTML, and Markdown formats."
    }

    if (lowerQuery.includes("markdown")) {
      return "Yes, our editor fully supports Markdown syntax. You can use headings, lists, code blocks, tables, and other Markdown formatting in your documents."
    }

    return "I'm not sure I understand. Could you provide more details or rephrase your question? You can ask about creating documents, managing folders, inviting team members, or account settings."
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user"

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}
      >
        <div className={cn("flex items-start max-w-[80%] gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
          {isUser ? (
            userProfileImage ? (
              <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden border border-primary/20">
                <img
                  src={userProfileImage || "/placeholder.svg"}
                  alt="Your profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )
          ) : (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-black">
              <div className="relative h-5 w-5">
                {/* TODO: add images back to all "src" tags */}
                <Image src="/placeholder.png" alt="Logo" fill className="object-contain" priority />
              </div>
            </div>
          )}
          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm text-left",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            )}
          >
            {message.content}
          </div>
        </div>
      </motion.div>
    )
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const scrollSuggestions = (direction: "left" | "right") => {
    if (!suggestionsRef.current) return

    const scrollAmount = 200 // Adjust as needed
    const currentScroll = suggestionsRef.current.scrollLeft

    suggestionsRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <>
      {children && <div onClick={toggleChat}>{children}</div>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 w-80 sm:w-96 bottom-4 right-4 sm:bottom-8 sm:right-8"
            id="support-chatbot-container"
          >
            <ShineBorder
              borderRadius={12}
              borderWidth={3}
              duration={8}
              color={["#3b82f6", "#10b981", "#6366f1", "#8b5cf6"]}
            >
              <div
                className={cn("overflow-hidden w-full h-full", isMinimized ? "h-auto" : "max-h-[90vh] flex flex-col")}
                style={{
                  maxHeight: isMinimized ? "auto" : "calc(100vh - 2rem)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b py-4 px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black overflow-hidden">
                      <div className="relative h-6 w-6">
                        <Image src="/placeholder.png" alt="Logo" fill className="object-contain" priority />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-base">Documentation Assistant</div>
                      <div className="flex items-center mt-0.5">
                        <Badge variant="success" className="text-xs px-1 py-0 h-4">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={toggleMinimize}
                      aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:text-white/80"
                      onClick={handleClose}
                      aria-label="Close chat"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chat content */}
                {!isMinimized && (
                  <>
                    <div className="flex-grow overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
                      {messages.map(renderMessage)}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                            <div className="relative h-5 w-5">
                              <Image src="/placeholder.png" alt="Logo" fill className="object-contain" priority />
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                            />
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Questions - Horizontal Scrollable Row */}
                    <div className="border-t p-3 bg-background relative">
                      <div className="mb-2 text-xs text-muted-foreground font-medium">Suggested questions:</div>
                      <div className="relative">
                        {/* Left scroll button */}
                        {showScrollLeft && (
                          <button
                            onClick={() => scrollSuggestions("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-sm"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}

                        {/* Scrollable container */}
                        <div
                          ref={suggestionsRef}
                          className="flex overflow-x-auto py-1 px-1 gap-2 no-scrollbar scroll-smooth"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {suggestedQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestedQuestion(question)}
                              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors whitespace-nowrap flex-shrink-0"
                            >
                              {question}
                            </button>
                          ))}
                        </div>

                        {/* Right scroll button */}
                        {showScrollRight && (
                          <button
                            onClick={() => scrollSuggestions("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-sm"
                            aria-label="Scroll right"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Input area */}
                    <form onSubmit={handleSubmit} className="border-t p-3 bg-background sticky bottom-0 w-full">
                      <div className="flex items-center gap-3 p-1.5 bg-muted/30 rounded-lg shadow-sm transition-all focus-within:shadow-md focus-within:bg-background hover:bg-muted/40">
                        <Input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-1.5 h-auto text-sm"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!input.trim()}
                          className="p-2 bg-transparent hover:bg-muted/50 text-primary hover:text-primary/80 transition-colors rounded-md"
                          aria-label="Send message"
                          onClick={(e) => {
                            if (input.trim()) {
                              handleSubmit(e)
                            }
                          }}
                        >
                          <Send className="h-4 w-4 stroke-[2.5px] text-white" />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-center text-muted-foreground opacity-70">
                        Press Enter to send, Shift+Enter for a new line
                      </div>
                    </form>
                  </>
                )}
              </div>
            </ShineBorder>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
