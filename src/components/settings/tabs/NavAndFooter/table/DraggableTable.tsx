import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';

import MenuItemRow from './MenuItemRow';
import { useAppStore } from '@/store/useAppStore';
import { MenuItemType } from '@/interface/settings';
import { useQueryState } from 'nuqs';
import ActionModal from '../modals/ActionModal';

type DraggableTableProps = {
  type: 'navigation' | 'footer';
};

const COLUMN_HEADERS = ['MENU', 'URL', 'ACTIONS'];

const DraggableTable: React.FC<DraggableTableProps> = ({ type }) => {
  const { settings } = useAppStore();
  const [paramMode] = useQueryState('mode');
  const [paramMenuId] = useQueryState('menu_id');

  const [menuItems, setMenuItems] = useState<MenuItemType[]>(settings?.navigation_footer?.[type] || []);

  useEffect(() => {
    setMenuItems(settings?.navigation_footer?.[type] || []);
  }, [settings?.navigation_footer, type]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setMenuItems((prevItems) => {
      const oldIndex = prevItems.findIndex(item => item.menu_id === active.id);
      const newIndex = prevItems.findIndex(item => item.menu_id === over.id);
      return arrayMove(prevItems, oldIndex, newIndex);
    });
  }, []);

  const selectedMenuItem = useMemo(() => {
    return menuItems.find(item => item.menu_id === paramMenuId);
  }, [menuItems, paramMenuId]);

  const renderColumnHeaders = () => (
    <div className="grid grid-cols-[48px,1fr,100px] p-4 w-full">
      <span />
      <div className="grid grid-cols-[200px,1fr,200px] flex-1">
        {COLUMN_HEADERS.slice(0, 2).map((header, idx) => (
          <span
            key={header}
            className={`text-sm font-bold text-[#8F8F8F] ${idx === 1 ? 'ml-[30%]' : ''}`}
          >
            {header}
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-[#8F8F8F]">{COLUMN_HEADERS[2]}</span>
    </div>
  );

  const renderMenuItems = () => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={menuItems.map(item => item.menu_id)}
        strategy={verticalListSortingStrategy}
      >
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <MenuItemRow
              key={item.menu_id}
              menu_id={item.menu_id}
              menu_name={item.menu_name}
              menu_link={item.menu_link as any}
              type={type}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-20">No items found</div>
        )}
      </SortableContext>
    </DndContext>
  );

  return (
    <>
      <div className="flex flex-col">
        {renderColumnHeaders()}
        {renderMenuItems()}
      </div>

      <ActionModal
        type={type}
        title={type === 'navigation' ? 'Navigation Menu Item' : 'Footer Menu Item'}
        open={paramMode === type}
        initialData={selectedMenuItem as any}
      />
    </>
  );
};

export default DraggableTable;
