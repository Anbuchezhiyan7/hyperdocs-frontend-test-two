'use client';

import React from 'react';
import { Skeleton } from 'antd';

export default function LeadsLoading() {
    return (
        <div className="w-full min-h-screen bg-[#F9FAFB]">
            {/* Navbar Skeleton */}
            <div className="h-[72px] bg-white border-b border-gray-100 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton.Button active size="small" shape="square" />
                    <Skeleton.Input active size="small" style={{ width: 150 }} />
                </div>
            </div>
            
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                {/* Stats Section Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    ))}
                </div>

                {/* Header Actions Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Skeleton.Input active style={{ width: '100%', maxWidth: 400 }} />
                        <Skeleton.Button active style={{ width: 150 }} />
                    </div>
                </div>

                {/* Tabs & Table Section Skeleton */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 pt-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex gap-8">
                            {[1, 2, 3].map(i => (
                                <Skeleton.Button key={i} active size="small" style={{ width: 80 }} />
                            ))}
                        </div>
                        <Skeleton.Button active size="small" style={{ width: 120 }} />
                    </div>

                    <div className="p-6">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
