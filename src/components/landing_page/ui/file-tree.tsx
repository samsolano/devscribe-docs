"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeProps {
  children?: React.ReactNode
  elements: TreeElement[]
  initialSelectedId?: string
  initialExpandedItems?: string[]
  className?: string
}

interface TreeElement {
  id: string
  name: string
  isSelectable?: boolean
  children?: TreeElement[]
}

const TreeContext = React.createContext<{
  selectedItemId: string | null
  expandedItems: string[]
  setSelectedItemId: (id: string | null) => void
  toggleExpandedItem: (id: string) => void
}>({
  selectedItemId: null,
  expandedItems: [],
  setSelectedItemId: () => {},
  toggleExpandedItem: () => {},
})

export function Tree({
  children,
  elements,
  initialSelectedId = null,
  initialExpandedItems = [],
  className,
}: TreeProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(initialSelectedId)
  const [expandedItems, setExpandedItems] = React.useState<string[]>(initialExpandedItems)

  const toggleExpandedItem = React.useCallback((id: string) => {
    setExpandedItems((items) => {
      if (items.includes(id)) {
        return items.filter((item) => item !== id)
      }
      return [...items, id]
    })
  }, [])

  return (
    <TreeContext.Provider
      value={{
        selectedItemId,
        expandedItems,
        setSelectedItemId,
        toggleExpandedItem,
      }}
    >
      <div className={cn("text-sm", className)}>
        {children || (
          <ul className="flex flex-col gap-1">
            {elements.map((element) => (
              <TreeItem key={element.id} element={element} />
            ))}
          </ul>
        )}
      </div>
    </TreeContext.Provider>
  )
}

interface TreeItemProps {
  element: TreeElement
  level?: number
  value?: string
}

export function TreeItem({ element, level = 0, value }: TreeItemProps) {
  const { selectedItemId, expandedItems, setSelectedItemId, toggleExpandedItem } = React.useContext(TreeContext)

  const id = value || element.id
  const isSelected = selectedItemId === id
  const isExpanded = expandedItems.includes(id)
  const hasChildren = element.children && element.children.length > 0

  const handleClick = () => {
    if (element.isSelectable) {
      setSelectedItemId(id)
    }
    if (hasChildren) {
      toggleExpandedItem(id)
    }
  }

  return (
    <li className="flex flex-col">
      <button
        className={cn("flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted", isSelected && "bg-muted")}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}
        {typeof element === "string" ? (
          element
        ) : (
          <span className="flex items-center gap-2">
            {hasChildren ? <Folder className="h-4 w-4 shrink-0" /> : <FileIcon className="h-4 w-4 shrink-0" />}
            {element.name}
          </span>
        )}
      </button>
      {hasChildren && isExpanded && (
        <ul className="flex flex-col gap-1">
          {element.children!.map((child) => (
            <TreeItem key={child.id} element={child} level={level + 1} value={child.id} />
          ))}
        </ul>
      )}
    </li>
  )
}

interface TreeNodeProps {
  element: React.ReactNode
  children?: React.ReactNode
  value: string
}

export function TreeNode({ element, children, value }: TreeNodeProps) {
  const { selectedItemId, expandedItems, setSelectedItemId, toggleExpandedItem } = React.useContext(TreeContext)

  const isSelected = selectedItemId === value
  const isExpanded = expandedItems.includes(value)

  const handleClick = () => {
    setSelectedItemId(value)
    toggleExpandedItem(value)
  }

  return (
    <li className="flex flex-col">
      <button
        className={cn("flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted", isSelected && "bg-muted")}
        onClick={handleClick}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <span className="flex items-center gap-2">
          <Folder className="h-4 w-4 shrink-0" />
          {element}
        </span>
      </button>
      {isExpanded && <ul className="flex flex-col gap-1">{children}</ul>}
    </li>
  )
}

interface FileProps {
  children?: React.ReactNode
  value: string
}

export function File({ children, value }: FileProps) {
  const { selectedItemId, setSelectedItemId } = React.useContext(TreeContext)
  const isSelected = selectedItemId === value

  return (
    <li>
      <button
        className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-muted", isSelected && "bg-muted")}
        onClick={() => setSelectedItemId(value)}
      >
        <span className="w-4" />
        <span className="flex items-center gap-2">
          <FileIcon className="h-4 w-4 shrink-0" />
          {children}
        </span>
      </button>
    </li>
  )
}

export const Folder = ({
  children,
  value,
  element,
}: { children?: React.ReactNode; value: string; element: React.ReactNode }) => {
  const { selectedItemId, expandedItems, setSelectedItemId, toggleExpandedItem } = React.useContext(TreeContext)

  const isSelected = selectedItemId === value
  const isExpanded = expandedItems.includes(value)

  const handleClick = () => {
    setSelectedItemId(value)
    toggleExpandedItem(value)
  }

  return (
    <li className="flex flex-col">
      <button
        className={cn("flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted", isSelected && "bg-muted")}
        onClick={handleClick}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <span className="flex items-center gap-2">
          <Folder className="h-4 w-4 shrink-0" />
          {element}
        </span>
      </button>
      {isExpanded && <ul className="flex flex-col gap-1">{children}</ul>}
    </li>
  )
}
