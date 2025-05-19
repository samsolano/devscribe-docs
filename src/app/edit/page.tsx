"use client"

import React, { useState, ChangeEvent, useEffect } from 'react'
import Markdoc from '@markdoc/markdoc';
import { components, config } from "../config.markdoc";
import Filetree from '@/components/layout/Filetree';
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link';


type PageProps = {
  slug: string
}


export default function Home({ slug }: PageProps) {
  const [text, setText] = useState("");
  const [parsedContent, setParsedContent] = useState<React.ReactNode | null>(null);
  const [edit, setEdit] = useState(false)

  // Add this function to handle file clicks
  const handleFileClick = async (contentUrl: string) => {
    try {
      const response = await fetch(contentUrl);
      if (!response.ok) throw new Error('Failed to fetch file content');
      const content = await response.text();
      setText(content);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  useEffect(() => {
    try {
      // Parse the markdown content
      const ast = Markdoc.parse(text);
      // Transform the AST using the config
      const content = Markdoc.transform(ast, config);
      // Render the content
      const rendered = Markdoc.renderers.react(content, React, { components });
      setParsedContent(rendered);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setParsedContent(<div className="text-red-500">Error parsing markdown</div>);
    }
  }, [text]);

  return (
    <div className="flex w-full h-screen">
      <div className='flex-none w-1/6 p-2 text-sm'>
        <Link
          href="/"
          className="sidebar-link font-bold flex items-center gap-4 px-4 py-2 rounded-md transition-all duration-200 text-devscribe-text-secondary hover:text-white mb-4 text-sm"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <Filetree onFileClick={handleFileClick} />
      </div>

      <div className="flex-1 border border-devscribe-border p-4">
        <textarea
          readOnly={!edit}
          className="w-full h-full bg-gray-900 text-gray-100 p-4 rounded resize-none focus:outline-none text-sm"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        />
      </div>

      <div className="flex-1 border border-devscribe-border p-4 overflow-auto">
        <div className='flex flex-col'>
          <div className='border-b border-devscribe-border flex justify-end gap-4'>
            <button
              className="px-4 py-2 mb-2 rounded-md bg-amber-700 text-amber-400 hover:text-white transition-colors duration-200 text-sm"
              onClick={() => {
                setEdit(!edit);
              }}
              >
              Edit
            </button>
            <button
              className="px-4 py-2 mb-2 rounded-md bg-lime-700 text-lime-400 hover:text-white transition-colors duration-200 text-sm"
              onClick={() => {
                setEdit(!edit);
              }}
              >
              Save
            </button>
          </div>
          <div className="prose prose-invert max-w-none prose-sm">
            {parsedContent}
          </div>
        </div>
      </div>
    </div>
  )
}