import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditOulineIcon, DeleteOutlinedIcon, DragDotIcon } from '@/assets/icons';
import { PlusIcon } from '@/assets/icons';
import { Button } from 'antd';
import Link from 'next/link';
import DeleteModal from '@/components/common/Modals/DeleteModal';
import { apiDeleteMenu } from '@/api/settings';
import { showToast } from '@/components/common/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { LinkType } from '@/interface/settings';

interface MenuItemProps {
    menu_id: string;
    menu_name: string;
    menu_link: any;
    type: 'navigation' | 'footer';
}

const DragHandle = ({ attributes, listeners }: any) => (
    <span {...attributes} {...listeners} className="cursor-grab">
        <DragDotIcon />
    </span>
);

const FooterLinks = ({ links }: { links: LinkType[] }) => (
    <div className="flex gap-2 flex-wrap">
        {links?.map((link, index) => (
            <Link
                key={index}
                href={link?.link_url}
                target="_blank"
                className="px-2 py-1 bg-[#FFEEE5] text-[#FF5200] text-xs font-medium rounded"
            >
                {link?.link_name}
            </Link>
        ))}
    </div>
);

const NormalLink = ({ link }: { link: string }) => (
    <Link
        href={link}
        target="_blank"
        className="block truncate text-sm font-semibold text-[#FF5200] max-w-full"
    >
        {link}
    </Link>
);

const MenuItemRow: React.FC<MenuItemProps> = ({ menu_id, menu_name, menu_link, type }) => {
    const queryClient = useQueryClient();
    const [, setParamMode] = useQueryState('mode');
    const [, setParamMenuId] = useQueryState('menu_id');

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const onEditClick = () => {
        setParamMode(type);
        setParamMenuId(menu_id);
    };

    const handleDelete = async () => {
        if (!menu_id || !type) return;
        setIsDeleteLoading(true);
        const { success, message, type: resType } = await apiDeleteMenu(type, menu_id);
        if (success) {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setIsDeleteOpen(false);
        }
        showToast(message, resType);
        setIsDeleteLoading(false);
    };

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: menu_id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className="flex items-center p-4 bg-white border-b border-[#E0E0E0] w-full"
            >
                <div className="mr-4">
                    <DragHandle attributes={attributes} listeners={listeners} />
                </div>
                <div className="grid grid-cols-[1fr_3fr_1fr] items-center gap-x-4 w-full">
                    <span className="text-sm font-medium text-[#333]">{menu_name}</span>

                    {type === 'footer' ? (
                        <FooterLinks links={menu_link} />
                    ) : (
                        <NormalLink link={menu_link} />
                    )}

                    <div className="flex items-center justify-center gap-2">
                        {type === 'footer' && (
                            <Button onClick={onEditClick} icon={<PlusIcon />} />
                        )}
                        <Button onClick={onEditClick} icon={<EditOulineIcon />} />
                        <Button
                            onClick={() => setIsDeleteOpen(true)}
                            icon={<DeleteOutlinedIcon />}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onAccept={handleDelete}
                isLoading={isDeleteLoading}
            />
        </>
    );
};

export default MenuItemRow;
