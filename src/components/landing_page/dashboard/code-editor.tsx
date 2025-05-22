"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CodeEditor() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Code Editor</CardTitle>
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="preview" className="m-0">
              <div className="flex h-[400px] items-center justify-center rounded-b-lg bg-muted p-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Component Preview</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    This is a preview of your component. Edit the code to see changes.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="code" className="m-0">
              <pre className="h-[400px] overflow-auto rounded-b-lg bg-muted p-4">
                <code className="text-sm text-foreground">{codeExample}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

const codeExample = `import React from 'react';

function Button({ children, onClick }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
`
