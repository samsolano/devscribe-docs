"use client"

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, FolderIcon, FolderOpenIcon, FileText } from 'lucide-react'

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

// Add this type at the top with other types
type FiletreeProps = {
  onFileClick?: (content: string) => void;
}

// Function to fetch repository contents
async function fetchRepoContents(owner: string, repo: string, path: string = ''): Promise<FileTree> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('GitHub API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Failed to fetch repository contents: ${response.status} ${response.statusText}`);
    }

    const contents = await response.json();

    // If it's a single file, return it directly
    if (!Array.isArray(contents)) {
      return [{
        name: contents.name,
        type: 'file' as const,
        content: contents.download_url
      }];
    }

    // Process each item in the directory
    const items = await Promise.all(
      contents.map(async (item) => {
        if (item.type === 'dir') {
          // Recursively fetch contents of subdirectories
          const children = await fetchRepoContents(owner, repo, `${path}${item.name}/`);
          return {
            name: item.name,
            type: 'folder' as const,
            children
          };
        } else {
          return {
            name: item.name,
            type: 'file' as const,
            content: item.download_url
          };
        }
      })
    );

    return items;
  } catch (error) {
    console.error('Error fetching repository contents:', error);
    return [];
  }
}

// Modify the TreeNode component to accept onFileClick
const TreeNode = ({ node, level = 0, onFileClick }: { node: FileNode | FolderNode, level?: number, onFileClick?: (content: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const paddingLeft = `${level * 1.25}rem`

  if (node.type === 'file') {
    return (
      <div
        className="flex items-center py-1 px-2 hover:bg-accent rounded cursor-pointer transition-colors"
        style={{ paddingLeft }}
        onClick={() => node.content && onFileClick?.(node.content)}
      >
        <FileText className="size-4 text-white mr-2" />
        <span className="text-foreground text-sm">{node.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-accent rounded cursor-pointer transition-colors"
        style={{ paddingLeft }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="size-4 text-white mr-1" />
        ) : (
          <ChevronRight className="size-4 text-white mr-1" />
        )}
        {isOpen ? (
          <FolderOpenIcon className="size-4 text-white mr-2" />
        ) : (
          <FolderIcon className="size-4 text-white mr-2" />
        )}
        <span className="text-foreground text-sm">{node.name}</span>
      </div>
      {isOpen && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// Update the Filetree component to accept and pass down the onFileClick prop
export default function Filetree({ onFileClick }: FiletreeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  useEffect(() => {
    const loadRepoStructure = async () => {
      try {
        setIsLoading(true);
        // Replace these with your repository details
        const owner = 'samsolano';
        const repo = 'API_Testing';
        const tree = await fetchRepoContents(owner, repo);
        setFileTree(tree);
      } catch (err) {
        setError('Failed to load repository structure');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRepoStructure();
  }, []);

  // Filter file tree by search query
  function filterTree(tree: FileTree, query: string): FileTree {
    if (!query) return tree;
    return tree
      .map((node) => {
        if (node.type === 'folder') {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query.toLowerCase())) {
            return { ...node, children: filteredChildren };
          }
          return null;
        } else {
          return node.name.toLowerCase().includes(query.toLowerCase()) ? node : null;
        }
      })
      .filter(Boolean) as FileTree;
  }

  const filteredTree = filterTree(fileTree, searchQuery);

  // Add folder handler (local only, not on GitHub)
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderNode = {
        name: newFolderName,
        type: 'folder',
        children: [],
      };
      setFileTree([...fileTree, newFolder]);
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-card rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="text-sm font-medium text-foreground">Folders</h2>
        {isAddingFolder ? (
          <div className="flex items-center gap-1">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="h-7 text-xs w-32 rounded border px-2 bg-background text-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFolder();
                if (e.key === "Escape") setIsAddingFolder(false);
              }}
              autoFocus
            />
            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-accent" onClick={handleAddFolder}>
              <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span className="sr-only">Add folder</span>
            </button>
            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-accent" onClick={() => setIsAddingFolder(false)}>
              <svg className="h-3 w-3 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <span className="sr-only">Cancel</span>
            </button>
          </div>
        ) : (
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent" onClick={() => setIsAddingFolder(true)}>
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span className="sr-only">New folder</span>
          </button>
        )}
      </div>
      {/* Search */}
      <div className="p-2 border-b">
        <input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-sm w-full rounded border px-2 bg-background text-foreground"
        />
      </div>
      {/* Tree */}
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="text-muted-foreground text-center py-4">Loading repository structure...</div>
        ) : error ? (
          <div className="text-red-400 text-center py-4">{error}</div>
        ) : (
          <div className="space-y-1">
            {filteredTree.length === 0 ? (
              <div className="text-muted-foreground text-xs text-center py-4">No files found.</div>
            ) : (
              filteredTree.map((node, index) => (
                <TreeNode key={index} node={node} onFileClick={onFileClick} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
