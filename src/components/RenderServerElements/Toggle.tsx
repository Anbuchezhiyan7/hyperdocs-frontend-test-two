"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import RichText from './RichText';

interface ToggleProps {
  header: any;
  children: any[];
}

const Toggle = ({ header, children }: ToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!header) return null;

  return (
    <div className="slate-toggle my-2 select-none group">
      {/* Toggle Header */}
      <div 
        className="flex items-center gap-1 cursor-pointer transition-colors rounded-sm px-0.5 py-0.5" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-shrink-0 text-slate-400 group-hover:text-slate-600">
           {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
        <div className="flex-1 text-[#0A0A0A] font-medium leading-relaxed">
           <RichText children={header?.children || []} />
        </div>
      </div>
      
      {/* Collapsible Content */}
      {isOpen && (
        <div className="ml-[18px] mt-1 border-l-2 border-slate-100 pl-4">
           {children.map((item: any, idx: number) => {
              if (item.type === 'p' && item.children) {
                return (
                  <div key={idx} className="my-1.5 text-[#0A0A0A] leading-relaxed text-base">
                    <RichText children={item.children} />
                  </div>
                );
              }
              return null;
           })}
        </div>
      )}
    </div>
  );
};

export default Toggle;
