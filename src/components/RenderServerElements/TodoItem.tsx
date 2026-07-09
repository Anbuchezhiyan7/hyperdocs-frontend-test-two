import React from 'react';
import { Check } from 'lucide-react';
import RichText from './RichText';

interface TodoItemData {
  children: any[];
  type: string;
  indent?: number;
  listStyleType: string;
  id: string;
  checked?: boolean;
}

interface TodoItemProps {
  block: TodoItemData;
  index: number;
}

const TodoItem = ({ block, index }: TodoItemProps) => {
  if (!block || !block.children || block.listStyleType !== 'todo') return null;

  const isChecked = block.checked === true;
  const indentLevel = block.indent || 0;

  return (
    <div 
      className="todo-item flex items-center gap-3 py-1.5 active:opacity-80 transition-opacity"
      style={{ marginLeft: `${indentLevel * 24}px` }}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        {isChecked ? (
          <div className="w-5 h-5 bg-[#0A0A0A] rounded flex items-center justify-center">
            <Check className="text-white w-3.5 h-3.5 stroke-[4px]" strokeLinecap="round" strokeLinejoin="round" />
          </div>
        ) : (
          <div className="w-5 h-5 border-2 border-[#0A0A0A] rounded bg-white"></div>
        )}
      </div>
      
      {/* Todo content using RichText to supporting bold, italic, etc */}
      <div className={`flex-1 text-[15px] leading-relaxed ${isChecked ? 'text-[#A1A1A1] line-through' : 'text-[#0A0A0A]'}`}>
        <RichText children={block.children} />
      </div>
    </div>
  );
};

export default TodoItem;
