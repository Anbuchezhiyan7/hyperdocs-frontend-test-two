import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragDotIcon } from '@/assets/icons';  

const DragHandle = ({ attributes, listeners }: any) => (
  <span {...attributes} {...listeners} className="cursor-grab">
    <DragDotIcon />
  </span>
);

export const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center gap-2">
      <DragHandle attributes={attributes} listeners={listeners} />
      {children}
    </div>
  );
};
