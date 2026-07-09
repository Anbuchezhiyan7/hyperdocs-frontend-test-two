'use client';

import Navbar from '@/components/common/Navbar';
import TableCard from '@/components/common/Tables/TableCard';
import TableActionButton from '@/components/common/Tables/TableActionButton';
import Button from '@/components/common/Buttons';
import { EditIcon as EditPencil, Trash2Icon } from 'lucide-react';
import { CategoriesIcon } from '@/assets/icons';
import { useQueryState } from 'nuqs';
import CategoryModal from '@/components/categories/modals';
import { Checkbox } from 'antd';
import { toast } from 'sonner';
import { categoriesApi } from '@/api/categories.api';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useMemo, useState } from 'react';
import DeleteCategoryModal from '@/components/categories/modals/DeleteCategoryModal';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface Category {
    category_id: string;
    category_name: string;
    created_at?: string;
    updated_at?: string;
}

export default function CategoryPage() {
    const [_, setParamMode] = useQueryState('mode');
    const [__, setId] = useQueryState('id');
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [search, setSearch] = useQueryState('search');
    const { settings } = useAppStore();

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories', search],
        queryFn: () => categoriesApi.handleGetAllCategories(search || ''),
    });

    const handleEdit = (id: string) => {
        setParamMode('edit');
        setId(id);
        setSelectedCategories([]);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setSelectedCategories([]);
        setIsDeleteOpen(true);
    };

    const handleBulkDelete = () => {
        if (!selectedCategories || selectedCategories.length === 0) {
            toast.warning('Please select at least one category to delete');
            return;
        }

        setDeleteId(null);
        setIsDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setIsDeleteOpen(false);
        setDeleteId(null);
        setSelectedCategories([]);
    };

    const isCategorySelected = (row: Record<string, any>) => {
        return selectedCategories.some(category => category?.category_id === row?.category_id);
    };

    const handleSelect = (row: Record<string, any>) => {
        if (!row) return;

        if (isCategorySelected(row)) {
            setSelectedCategories(
                selectedCategories.filter(category => category?.category_id !== row.category_id)
            );
        } else {
            setSelectedCategories([...selectedCategories, row as Category]);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCategories(categories || []);
        } else {
            setSelectedCategories([]);
        }
    };

    const columns = [
        {
            key: 'category_name',
            title: 'Category Name',
            render: (row: Record<string, any>) => (
                <div className="flex gap-2 items-center">
                    <Checkbox
                        checked={isCategorySelected(row)}
                        onChange={() => handleSelect(row)}
                    />
                    {row?.category_name}
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
                        onClick={() => handleEdit(row?.category_id)}
                    />
                    <TableActionButton
                        tooltip="Delete"
                        danger
                        icon={<Trash2Icon className="w-[18px] h-[18px]" />}
                        onClick={() => handleDelete(row?.category_id)}
                    />
                </div>
            ),
        },
    ];

    const selectedCategoriesToDelete = useMemo(() => {
        return selectedCategories.length > 0
            ? selectedCategories
            : [categories?.find((category: any) => category?.category_id === deleteId)];
    }, [selectedCategories, deleteId, categories]);

    return (
        <div className="flex flex-col w-full h-full">
            <Navbar titleIcon={<CategoriesIcon />} title="Categories" hideSearch hideBtn />
            <div className="flex-1 min-h-0 w-full overflow-y-auto">
                <TableCard
                    title="All Categories"
                    icon={<CategoriesIcon />}
                    searchValue={search || ''}
                    onSearch={val => setSearch(val || null)}
                    searchPlaceholder="Search categories..."
                    addLabel="Add New Category"
                    onAdd={() => {
                        setParamMode('create');
                        setSelectedCategories([]);
                    }}
                    secondaryButton={
                        selectedCategories.length > 0 ? (
                            <Button danger onClick={handleBulkDelete} className="!rounded-lg">
                                Delete Selected
                            </Button>
                        ) : undefined
                    }
                    subHeader={
                        selectedCategories.length > 0 ? (
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                                <Checkbox
                                    checked={selectedCategories.length === categories.length}
                                    onChange={e => handleSelectAll(e.target.checked)}
                                >
                                    Select All
                                </Checkbox>
                                <span className="text-sm text-gray-500">
                                    {selectedCategories.length} category(s) selected
                                </span>
                            </div>
                        ) : undefined
                    }
                    columns={columns}
                    data={categories.map((category: any) => ({
                        ...category,
                        id: category.category_id,
                    }))}
                    isLoading={isLoadingCategories}
                />
            </div>
            <CategoryModal />
            <DeleteCategoryModal
                open={isDeleteOpen}
                selectedCategories={selectedCategoriesToDelete as any}
                onClose={handleCloseDelete}
            />
        </div>
    );
}
