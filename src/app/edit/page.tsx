"use client"

import React, { useState, ChangeEvent, useEffect } from 'react'
import Markdoc from '@markdoc/markdoc';
import { components, config } from "../config.markdoc";
import Filetree from '@/components/layout/Filetree';
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link';

const firstpost = ` ---
title: First Post
---

# This is the first title
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.




{% break/ %}


## This will be indented in the table of contents
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% callout %}
With no title provided it takes the default title provided in the config.
{% /callout %}


{% break/ %}



{% callout title="test" %}
Provide a title in the tag and it's used in the component
{% /callout %}

whats going
{% superscript %}
hello
{% /superscript %}
on

# hello sir

{% card description="howdy yall" %}
was gucci
{% /card %}

asdfasd

hello sirs`

type PageProps = {
  slug: string
}


export default function Home({ slug }: PageProps) {
  const [text, setText] = useState(firstpost);
  const [parsedContent, setParsedContent] = useState<React.ReactNode | null>(null);
  const [edit, setEdit] = useState(false)

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

      <div className='flex-none w-1/6 p-2'>

        <Link
          href="/"
          className="sidebar-link font-bold flex items-center gap-4 px-4 py-2 rounded-md transition-all duration-200 text-devscribe-text-secondary hover:text-white mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>

        <Filetree />
      </div>


      <div className="flex-1 border border-devscribe-border p-4">
        <textarea
          className="w-full h-full bg-gray-900 text-gray-100 p-4 rounded resize-none focus:outline-none"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        />
      </div>

    
      <div className="flex-1 border border-devscribe-border p-4 overflow-auto">
        <div className='flex flex-col'>
            <div className='border-b border-devscribe-border flex justify-end'>
                <button className="px-4 py-2 mb-2 rounded-md bg-amber-700 text-amber-400 hover:text-white transition-colors duration-200">
                    Edit
                </button>
            </div>
            <div className="prose prose-invert max-w-none">
            {parsedContent}
            </div>
        </div>
      </div>
    </div>
  )
}