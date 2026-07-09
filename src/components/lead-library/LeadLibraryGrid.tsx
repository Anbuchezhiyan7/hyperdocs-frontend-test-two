'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Magnet, Tag, Calendar, Loader2 } from 'lucide-react';
import { Modal } from 'antd';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import { useLeadMagnetLibraryService } from '@/services/lead-magnet-library.service';
import { LeadMagnetLibraryItem } from '@/api/lead-magnet-library.api';
import leadMagnetLibraryApi from '@/api/lead-magnet-library.api';
import LeadMagnetCreateModal from './LeadMagnetCreateModal';
import LeadMagnetTemplatePreview from './LeadMagnetTemplatePreview';
import { toast } from 'sonner';

interface LeadLibraryGridProps {
    onCreateNew: () => void;
}

/* ── Card skeleton ── */
const CardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="w-full h-40 bg-gray-100" />
        <div className="p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
                <div className="h-4 bg-gray-200 rounded-lg flex-1" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg shrink-0" />
            </div>
            <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
            <div className="flex gap-1 mt-1">
                <div className="h-4 w-12 bg-orange-50 rounded-full" />
                <div className="h-4 w-14 bg-orange-50 rounded-full" />
            </div>
            <div className="h-2 w-24 bg-gray-50 rounded mt-1" />
        </div>
    </div>
);


const LeadLibraryGrid: React.FC<LeadLibraryGridProps> = ({ onCreateNew }) => {
    const { magnets, isFetchingMagnets, deleteMagnet, isDeleting, refetchMagnets } = useLeadMagnetLibraryService();
    const [editItem, setEditItem] = useState<LeadMagnetLibraryItem | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<LeadMagnetLibraryItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [fetchingCardId, setFetchingCardId] = useState<string | null>(null);

    const handleModalSaved = () => {
        setIsEditModalOpen(false);
        setEditItem(null);
        // React Query invalidation in useSendData handles the list refresh
    };

    const handleDeleteClick = (e: React.MouseEvent, item: LeadMagnetLibraryItem) => {
        e.stopPropagation();
        setDeleteTarget(item);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget.lead_magnet_instance_id);
        try {
            await deleteMagnet({ id: deleteTarget.lead_magnet_instance_id });
        } finally {
            setDeletingId(null);
            setDeleteTarget(null);
        }
    };

    /* ── GET by instance_id then open modal with fresh data ── */
    const handleCardClick = async (magnet: LeadMagnetLibraryItem) => {
        const id = magnet.lead_magnet_instance_id;
        setFetchingCardId(id);
        try {
            const fresh = await leadMagnetLibraryApi.getById(id);
            setEditItem(fresh ?? magnet);   // fallback to list data if API returns nothing
        } catch {
            toast.error('Failed to load details');
            setEditItem(magnet);            // fallback: still open with list data
        } finally {
            setFetchingCardId(null);
            setIsEditModalOpen(true);
        }
    };

    /* ── Loading skeletons ── */
    if (isFetchingMagnets) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
        );
    }

    const magnetList = Array.isArray(magnets) ? magnets : [];

    /* ── Empty state ── */
    if (magnetList.length === 0) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 shadow-sm">
                        <Magnet size={36} className="text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Lead Magnets Yet</h2>
                    <p className="text-gray-500 text-sm max-w-sm mb-1">
                        Create your first lead magnet to start collecting leads from your blog readers.
                    </p>
                    <p className="text-gray-400 text-xs max-w-xs mb-8">
                        Choose from beautiful templates and configure fields, PDF downloads, and CTA buttons — all in one place.
                    </p>
                    <button
                        onClick={onCreateNew}
                        className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-md"
                    >
                        <Plus size={18} />
                        Create Your First Lead Magnet
                    </button>
                </div>

                <LeadMagnetCreateModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setEditItem(null); }}
                    editItem={editItem}
                    onSaved={handleModalSaved}
                />
            </>
        );
    }

    /* ── Cards grid ── */
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {magnetList.map(magnet => {
                    const templateNum = magnet.template_number;
                    const template = LeadMagnetTemplates.find(t =>
                        t.id === magnet.template_id || t.id === templateNum
                    );
                    const isThisDeleting = deletingId === magnet.lead_magnet_instance_id;
                    const isThisFetching = fetchingCardId === magnet.lead_magnet_instance_id;
                    const isDisabled = isThisDeleting || isThisFetching;

                    return (
                        <div
                            key={magnet.lead_magnet_instance_id}
                            onClick={() => !isDisabled && handleCardClick(magnet)}
                            className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                                isDisabled
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:shadow-xl hover:border-orange-200 cursor-pointer'
                            }`}
                        >
                            {/* Live template preview */}
                            <div className="w-full h-40 relative overflow-hidden">
                                <LeadMagnetTemplatePreview magnet={magnet} height={160} />

                                {/* Fetching overlay */}
                                {isThisFetching && (
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                                        <Loader2 size={24} className="animate-spin text-orange-500" />
                                    </div>
                                )}

                                {/* Template badge */}
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-600 shadow-sm z-10">
                                    {template?.name ?? magnet.template_number ?? 'Template'}
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-4 flex flex-col gap-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">
                                        {magnet.lead_magnet_instance_title || magnet.lead_magnet_instance_name}
                                    </h3>
                                    <button
                                        onClick={e => handleDeleteClick(e, magnet)}
                                        disabled={isDisabled}
                                        className="shrink-0 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-40"
                                        title="Delete"
                                    >
                                        {isThisDeleting ? (
                                            <div className="w-[15px] h-[15px] border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 size={15} />
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                    <Tag size={10} />
                                    {magnet.lead_magnet_instance_name}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-2">
                                    {magnet.required_form_fields?.map(f => (
                                        <span key={f} className="text-[10px] bg-orange-50 text-orange-500 font-semibold px-2 py-0.5 rounded-full capitalize">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                {magnet.created_at && (
                                    <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                                        <Calendar size={9} />
                                        {new Date(magnet.created_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Delete confirm modal ── */}
            <Modal
                open={!!deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                onOk={confirmDelete}
                okText={isDeleting ? 'Deleting…' : 'Delete'}
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: isDeleting }}
                title="Delete Lead Magnet"
                width={420}
            >
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-800">"{deleteTarget?.lead_magnet_instance_name}"</span>?
                    This cannot be undone.
                </p>
            </Modal>

            {/* ── Edit modal (prefilled with GET response) ── */}
            <LeadMagnetCreateModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditItem(null); }}
                editItem={editItem}
                onSaved={handleModalSaved}
            />
        </>
    );
};

export default LeadLibraryGrid;
