"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import RichText from './RichText';

interface CodeBlockProps {
  block: any;
  index: number;
}

const CodeBlock = ({ block, index }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // Add null checks for block and its properties
  if (!block || !block.children || !Array.isArray(block.children) || block.children.length === 0) return null;
  
  // Logic to get plain text for copying
  const getRawContent = () => {
    return block.children
      .map((line: any) => {
        if (line.children && Array.isArray(line.children)) {
          return line.children.map((c: any) => c.text || '').join('');
        }
        return '';
      })
      .join('\n');
  };

  const handleCopy = () => {
    const content = getRawContent();
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div key={index} className="relative rounded-md bg-muted/50 my-6 group">
      <pre className="overflow-x-auto whitespace-normal p-8 pr-4 font-mono text-sm leading-10 [tab-size:2] print:break-inside-avoid bg-muted/50">
        <code>
          {block.children.map((line: any, lineIdx: number) => (
            <div 
              key={line.id || lineIdx} 
              className="slate-code_line text-[#0A0A0A]" 
              data-block-id={line.id} 
              style={{ position: 'relative' }}
            >
              <RichText children={line.children} />
            </div>
          ))}
        </code>
      </pre>

      {/* Copy Button Container */}
      <div className="absolute top-1 right-1 z-10 flex gap-0.5 select-none">
        <button 
          onClick={handleCopy}
          className="inline-flex cursor-pointer select-none items-center justify-center font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-md px-1.5 hover:bg-accent hover:text-accent-foreground size-6 gap-1 text-xs text-muted-foreground"
          title="Copy code"
        >
          <span className="sr-only">Copy</span>
          {copied ? (
            <Check className="!size-3 text-green-600 shadow-sm" />
          ) : (
            <Copy className="!size-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock;
