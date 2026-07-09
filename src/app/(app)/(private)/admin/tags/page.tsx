'use client';

import Navbar from '@/components/common/Navbar';
import TableCard from '@/components/common/Tables/TableCard';
import TableActionButton from '@/components/common/Tables/TableActionButton';
import Button from '@/components/common/Buttons';
import { EditIcon as EditPencil, Trash2Icon } from 'lucide-react';
import { TagsIcon } from '@/assets/icons';
import { useQueryState } from 'nuqs';
import { Checkbox } from 'antd';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useMemo, useState } from 'react';
import { tagsApi } from '@/api/tags.api';
import DeleteTagModal from '@/components/tags/modals/DeleteTagModal';
import TagModal from '@/components/tags/modals';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface Tag {
    tag_id: string;
    tag_name: string;
    created_at?: string;
    updated_at?: string;
}

export default function TagPage() {
    const [_, setParamMode] = useQueryState('mode');
    const [search, setSearch] = useQueryState('search');
    const [__, setId] = useQueryState('id');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { settings } = useAppStore();

    const { data: tags = [], isLoading: isLoadingTags } = useQuery({
        queryKey: ['tags', search],
        queryFn: () => tagsApi.handleGetAllTags(search || ''),
    });

    const handleEdit = (id: string) => {
        setParamMode('edit');
        setId(id);
        setSelectedTags([]);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setSelectedTags([]);
        setIsDeleteOpen(true);
    };

    const handleBulkDelete = () => {
        if (!selectedTags || selectedTags.length === 0) {
            toast.warning('Please select at least one tag to delete');
            return;
        }

        setDeleteId(null);
        setIsDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setIsDeleteOpen(false);
        setDeleteId(null);
        setSelectedTags([]);
    };

    const isTagSelected = (row: Record<string, any>) => {
        return selectedTags.some(tag => tag?.tag_id === row?.tag_id);
    };

    const handleSelect = (row: Record<string, any>) => {
        if (!row) return;

        if (isTagSelected(row)) {
            setSelectedTags(selectedTags.filter(tag => tag?.tag_id !== row.tag_id));
        } else {
            setSelectedTags([...selectedTags, row as Tag]);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTags(tags || []);
        } else {
            setSelectedTags([]);
        }
    };

    const columns = [
        {
            key: 'category_name',
            title: 'Category Name',
            render: (row: Record<string, any>) => (
                <div className="flex gap-2 items-center">
                    <Checkbox checked={isTagSelected(row)} onChange={() => handleSelect(row)} />
                    {row?.tag_name}
                </div>
            ),
        },
        {
            key: 'created_at',
            title: 'Created At',
            render: (row: Record<string, any>) => (
                <span>
                    {formatDateTime(row?.created_at, settings.general.time_zone, 'DD MMM YYYY')}
                </span>
            ),
        },
        {
            key: 'updated_at',
            title: 'Updated At',
            render: (row: Record<string, any>) => (
                <span>
                    {formatDateTime(row?.updated_at, settings.general.time_zone, 'DD MMM YYYY')}
                </span>
            ),
        },
        {
            key: 'action',
            title: 'Actions',
            render: (row: Record<string, any>) => (
                <div className="flex gap-2">
                    <TableActionButton
                        tooltip="Edit"
                        icon={<EditPencil className="w-[18px] h-[18px]" />}
                        onClick={() => handleEdit(row?.tag_id)}
                    />
                    <TableActionButton
                        tooltip="Delete"
                        danger
                        icon={<Trash2Icon className="w-[18px] h-[18px]" />}
                        onClick={() => handleDelete(row?.tag_id)}
                    />
                </div>
            ),
        },
    ];

    const selectedTagsToDelete = useMemo(() => {
        return selectedTags.length > 0
            ? selectedTags
            : [tags?.find((tag: any) => tag?.tag_id === deleteId)];
    }, [selectedTags, deleteId, tags]);

    return (
        <div className="flex flex-col w-full h-full">
            <Navbar titleIcon={<TagsIcon />} title="Tags" hideSearch hideBtn />
            <div className="flex-1 min-h-0 w-full overflow-y-auto">
                <TableCard
                    title="All Tags"
                    icon={<TagsIcon />}
                    searchValue={search || ''}
                    onSearch={val => setSearch(val || null)}
                    searchPlaceholder="Search tags..."
                    addLabel="Add New Tag"
                    onAdd={() => {
                        setParamMode('create');
                        setSelectedTags([]);
                    }}
                    secondaryButton={
                        selectedTags.length > 0 ? (
                            <Button danger onClick={handleBulkDelete} className="!rounded-lg">
                                Delete Selected
                            </Button>
                        ) : undefined
                    }
                    subHeader={
                        selectedTags.length > 0 ? (
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                                <Checkbox
                                    checked={selectedTags.length === tags.length}
                                    onChange={e => handleSelectAll(e.target.checked)}
                                >
                                    Select All
                                </Checkbox>
                                <span className="text-sm text-gray-500">
                                    {selectedTags.length} tag(s) selected
                                </span>
                            </div>
                        ) : undefined
                    }
                    columns={columns}
                    data={tags.map((tag: any) => ({ ...tag, id: tag.tag_id }))}
                    isLoading={isLoadingTags}
                />
            </div>
            <TagModal />
            <DeleteTagModal
                open={isDeleteOpen}
                selectedTags={selectedTagsToDelete as any}
                onClose={handleCloseDelete}
            />
        </div>
    );
}
