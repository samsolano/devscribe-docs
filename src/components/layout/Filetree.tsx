"use client"

import React, { useState, useEffect } from 'react'
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
  const paddingLeft = `${level * 1.5}rem`

  if (node.type === 'file') {
    return (
      <div 
        className="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer" 
        style={{ paddingLeft }}
        onClick={() => node.content && onFileClick?.(node.content)}
      >
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

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-center py-4">
          Loading repository structure...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-red-400 text-center py-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-gray-300 font-semibold mb-4">Repository Structure</div>
      <div className="space-y-1">
        {fileTree.map((node, index) => (
          <TreeNode key={index} node={node} onFileClick={onFileClick} />
        ))}
      </div>
    </div>
  );
}
