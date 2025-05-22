"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ProfileImageUploadProps {
  initialImage?: string | null
  onImageChange?: (image: string | null) => void
  className?: string
}

export function ProfileImageUpload({ initialImage, onImageChange, className }: ProfileImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    handleFile(file)
  }

  const handleFile = (file: File) => {
    // Reset error state
    setError(null)

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setError("Image size should be less than 5MB")
      return
    }

    // Simulate upload process
    setIsUploading(true)

    // Read the file and create a preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string

      // Simulate network delay
      setTimeout(() => {
        setImage(imageUrl)
        if (onImageChange) onImageChange(imageUrl)
        setIsUploading(false)

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
        })
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    handleFile(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImage(null)
    if (onImageChange) onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""

    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative w-32 h-32 rounded-full overflow-hidden border-2 border-border mb-4 transition-all",
          isDragging ? "border-primary border-dashed scale-105" : "",
          isUploading ? "opacity-70" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <img src={image || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        <AnimatePresence>
          {image && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1 right-1"
            >
              <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full" onClick={removeImage}>
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={triggerFileInput} disabled={isUploading}>
            <Upload className="h-4 w-4" />
            {image ? "Change Photo" : "Upload Photo"}
          </Button>
        </div>

        {error && <p className="text-xs text-destructive mt-1">{error}</p>}

        <p className="text-xs text-muted-foreground text-center">
          Supported formats: JPEG, PNG, GIF, WEBP. Max size: 5MB
        </p>
      </div>
    </div>
  )
}
