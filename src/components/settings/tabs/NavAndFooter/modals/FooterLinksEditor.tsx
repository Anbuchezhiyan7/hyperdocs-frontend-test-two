import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { Trash2Icon } from 'lucide-react';
import { Button } from 'antd';

import { SortableItem } from './SortableItem';
import { Input } from '@/components/common/Input';
import { LinkType } from '@/interface/settings';

type Props = {
  links: LinkType[];
  onChange: (links: LinkType[]) => void;
};

const MAX_LINKS = 5;

export const FooterLinksEditor: React.FC<Props> = ({ links, onChange }) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string);
    const newIndex = parseInt(over.id as string);

    if (!isNaN(oldIndex) && !isNaN(newIndex)) {
      const reordered = arrayMove(links, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const handleChange = (index: number, field: keyof LinkType, value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...links, { link_name: '', link_url: '' }]);
  };

  return (
    <div className="flex flex-col gap-2 min-h-[240px]">
      <div className='flex items-center justify-between mb-2'>
        <p className="font-medium text-sm text-gray-700">Add Links</p>
        {links.length < MAX_LINKS && (
          <Button onClick={handleAdd} size='small' className="w-fit text-xs rounded-lg px-5">
            Add +
          </Button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          {links.length > 0 ? (
            links.map((link, index) => (
              <SortableItem key={index} id={index.toString()}>
                <div className="flex items-center gap-2 w-full">
                  <Input
                    name={`name-${index}`}
                    inputType="text"
                    value={link.link_name}
                    onChange={(val) => handleChange(index, 'link_name', val)}
                    placeholder="Link name"
                    className="!mb-0 max-w-[30%]"
                  />
                  <Input
                    name={`url-${index}`}
                    inputType="url"
                    value={link.link_url}
                    onChange={(val) => handleChange(index, 'link_url', val)}
                    placeholder="Link URL"
                    className="!mb-0"
                  />
                  <button type="button" onClick={() => handleRemove(index)}>
                    <Trash2Icon className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              </SortableItem>
            ))
          ) : (
            <div className="text-center text-gray-500 py-20">No links added</div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};
