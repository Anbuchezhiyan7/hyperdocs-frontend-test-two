'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Globe, FileText, X, CheckSquare } from 'lucide-react';
import { Tooltip } from 'antd';

interface BulkActionBarProps {
    count: number;
    onPublish: () => void;
    onDraft: () => void;
    onDelete: () => void;
    onClear: () => void;
    isLoading: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
    count,
    onPublish,
    onDraft,
    onDelete,
    onClear,
    isLoading,
}) => {
    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    key="bulk-bar"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2"
                >
                    <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] border border-white/10 backdrop-blur-sm">
                        {/* Count badge */}
                        <div className="flex items-center gap-2 pr-3 border-r border-white/20">
                            <CheckSquare className="w-4 h-4 text-[#FF5200]" />
                            <span className="text-sm font-bold tabular-nums">
                                {count} selected
                            </span>
                        </div>

                        {/* Actions */}
                        <Tooltip title="Publish selected">
                            <button
                                onClick={onPublish}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all disabled:opacity-50"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                Publish
                            </button>
                        </Tooltip>

                        <Tooltip title="Move to draft">
                            <button
                                onClick={onDraft}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all disabled:opacity-50"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Draft
                            </button>
                        </Tooltip>

                        <Tooltip title="Delete selected">
                            <button
                                onClick={onDelete}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-all disabled:opacity-50"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </Tooltip>

                        {/* Clear */}
                        <Tooltip title="Clear selection">
                            <button
                                onClick={onClear}
                                className="ml-1 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
                                aria-label="Clear selection"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </Tooltip>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BulkActionBar;
