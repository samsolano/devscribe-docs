"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Folder, File } from 'lucide-react'

// Define the types for our file tree structure
type FileNode = {
  name: string
  type: 'file'
  content?: string
}

type FolderNode = {
  name: string
  type: 'folder'
  children: (FileNode | FolderNode)[]
}

type FileTree = (FileNode | FolderNode)[]

// Sample file tree data
const sampleFileTree: FileTree = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "layout",
            type: "folder",
            children: [
              { name: "Layout.tsx", type: "file" },
              { name: "Navbar.tsx", type: "file" },
              { name: "Sidebar.tsx", type: "file" }
            ]
          },
          { name: "Card.tsx", type: "file" }
        ]
      },
      {
        name: "app",
        type: "folder",
        children: [
          { name: "page.tsx", type: "file" },
          { name: "layout.tsx", type: "file" },
          {
            name: "api",
            type: "folder",
            children: [
              { name: "route.ts", type: "file" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "logo.png", type: "file" },
      { name: "favicon.ico", type: "file" }
    ]
  },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" }
]

// Component for rendering a single node (file or folder)
const TreeNode = ({ node, level = 0 }: { node: FileNode | FolderNode, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const paddingLeft = `${level * 1.5}rem`

  if (node.type === 'file') {
    return (
      <div className="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer" style={{ paddingLeft }}>
        <File size={16} className="text-blue-400 mr-2" />
        <span className="text-gray-300">{node.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div 
        className="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer" 
        style={{ paddingLeft }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown size={16} className="text-gray-400 mr-2" />
        ) : (
          <ChevronRight size={16} className="text-gray-400 mr-2" />
        )}
        <Folder size={16} className="text-yellow-400 mr-2" />
        <span className="text-gray-300">{node.name}</span>
      </div>
      {isOpen && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Filetree() {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-gray-300 font-semibold mb-4">Project Structure</div>
      <div className="space-y-1">
        {sampleFileTree.map((node, index) => (
          <TreeNode key={index} node={node} />
        ))}
      </div>
    </div>
  )
}
