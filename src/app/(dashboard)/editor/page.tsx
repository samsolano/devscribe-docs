"use client"

import React, { useState, ChangeEvent, useEffect } from 'react'
import Markdoc from '@markdoc/markdoc'
import { components, config } from "../../config.markdoc"
import Filetree from '@/components/layout/Filetree'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"

type PageProps = {
  slug: string
}

export default function EditorPage({ slug }: PageProps) {
  const [text, setText] = useState("")
  const [parsedContent, setParsedContent] = useState<React.ReactNode | null>(null)
  const [edit, setEdit] = useState(false)

  const handleFileClick = async (contentUrl: string) => {
    try {
      const response = await fetch(contentUrl)
      if (!response.ok) throw new Error('Failed to fetch file content')
      const content = await response.text()
      setText(content)
    } catch (error) {
      console.error('Error fetching file content:', error)
    }
  }

  useEffect(() => {
    try {
      const ast = Markdoc.parse(text)
      const content = Markdoc.transform(ast, config)
      const rendered = Markdoc.renderers.react(content, React, { components })
      setParsedContent(rendered)
    } catch (error) {
      console.error('Error parsing markdown:', error)
      setParsedContent(<div className="text-red-500">Error parsing markdown</div>)
    }
  }, [text])

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-2xl font-semibold">Editor</h1>
          <p className="text-muted-foreground">Create and edit your documentation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 h-full border-r bg-card flex flex-col">
          <div className="p-4 flex-1 min-h-0 overflow-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Filetree onFileClick={handleFileClick} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 flex">
          {/* Editor */}
          <div className="flex-1 min-h-0 border-r flex flex-col">
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="border-b p-4 flex justify-end gap-2">
                <Button
                  variant={edit ? "default" : "outline"}
                  onClick={() => setEdit(!edit)}
                  className="gap-2"
                >
                  {edit ? "Preview" : "Edit"}
                </Button>
                <Button
                  variant="default"
                  onClick={() => setEdit(!edit)}
                  className="gap-2"
                >
                  Save Changes
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-auto p-4">
                <textarea
                  readOnly={!edit}
                  className="w-full h-full bg-background text-foreground p-4 rounded-md resize-none focus:outline-none text-sm font-mono"
                  value={text}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="border-b p-4">
              <Badge variant="outline" className="gap-1 bg-sky-950 text-sky-400">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse relative">
                  <span className="absolute inset-0 rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                </span>
                Live Preview
              </Badge>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4">
              <div className="prose prose-invert max-w-none prose-sm">
                {parsedContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}