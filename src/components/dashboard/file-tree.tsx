"use client"

import { ChevronDown, ChevronUp, FileText, FolderIcon, FolderOpenIcon, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { CollapseButton, File, Folder, Tree, type TreeViewElement } from "@/components/dashboard/ui/tree"
import { Check, X } from "lucide-react"

// Sample file structure data
const initialFileStructure: TreeViewElement[] = [
  {
    id: "docs",
    name: "Documentation",
    children: [
      {
        id: "getting-started",
        name: "Getting Started",
        children: [
          { id: "installation", name: "Installation.md" },
          { id: "quick-start", name: "Quick Start.md" },
        ],
      },
      {
        id: "guides",
        name: "Guides",
        children: [
          { id: "authentication", name: "Authentication.md" },
          { id: "data-fetching", name: "Data Fetching.md" },
          { id: "error-handling", name: "Error Handling.md" },
        ],
      },
      {
        id: "api-reference",
        name: "API Reference",
        children: [
          { id: "endpoints", name: "Endpoints.md" },
          { id: "parameters", name: "Parameters.md" },
          { id: "responses", name: "Responses.md" },
        ],
      },
    ],
  },
  {
    id: "examples",
    name: "Examples",
    children: [
      { id: "basic-usage", name: "Basic Usage.md" },
      { id: "advanced-usage", name: "Advanced Usage.md" },
    ],
  },
]

export function FileTree() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [fileStructure, setFileStructure] = useState<TreeViewElement[]>(initialFileStructure)

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: TreeViewElement = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        children: [],
      }

      setFileStructure([...fileStructure, newFolder])
      setNewFolderName("")
      setIsAddingFolder(false)
    }
  }

  return (
    <div className="flex h-full flex-col border-r">
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="text-sm font-medium">Folders</h2>
        {isAddingFolder ? (
          <div className="flex items-center gap-1">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="h-7 text-xs w-32"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFolder()
                if (e.key === "Escape") setIsAddingFolder(false)
              }}
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAddFolder}>
              <Check className="h-3 w-3" />
              <span className="sr-only">Add folder</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAddingFolder(false)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAddingFolder(true)}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">New folder</span>
          </Button>
        )}
      </div>

      <div className="p-2 border-b">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <Tree
          elements={fileStructure}
          className="py-2"
          initialExpandedItems={["docs"]}
          openIcon={<FolderOpenIcon className="size-4" />}
          closeIcon={<FolderIcon className="size-4" />}
        >
          {fileStructure.map((item) => (
            <RenderTreeItem key={item.id} item={item} />
          ))}
          <CollapseButton elements={fileStructure}>
            {({ expandedItems }) =>
              expandedItems && expandedItems.length > 0 ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            }
          </CollapseButton>
        </Tree>
      </div>
    </div>
  )
}

// Helper component to recursively render tree items
function RenderTreeItem({ item }: { item: TreeViewElement }) {
  // Check if the item is a folder (has children array, even if empty)
  if (item.children) {
    return (
      <Folder key={item.id} value={item.id} element={item.name}>
        {item.children.map((child) => (
          <RenderTreeItem key={child.id} item={child} />
        ))}
      </Folder>
    )
  }

  return (
    <File key={item.id} value={item.id} fileIcon={<FileText className="size-4" />}>
      {item.name}
    </File>
  )
}
