'use client';

import { Skeleton } from 'antd';

/**
 * Loading placeholder for the editor's document body.
 *
 * Mirrors the editor's centered `fullWidth` column (mt-[70px] + the same
 * horizontal padding) so the skeleton sits exactly where the real content
 * will appear. The header/navbar is rendered separately and stays visible.
 */
export default function EditorSkeleton() {
    return (
        <div className="h-full overflow-hidden pt-20">
            <div className="mt-[70px] px-16 pt-4 sm:px-[max(64px,calc(50%-500px))]">
                {/* Title */}
                <Skeleton.Input active block style={{ height: 40, marginBottom: 12 }} />
                {/* Meta line (author • date) */}
                <Skeleton.Input active size="small" style={{ width: 220, height: 16 }} />

                {/* First paragraph */}
                <div className="mt-10">
                    <Skeleton active title={false} paragraph={{ rows: 3, width: ['100%', '100%', '70%'] }} />
                </div>

                {/* Feature image block */}
                <Skeleton.Node active className="!w-full" style={{ height: 200, marginTop: 32 }}>
                    <div />
                </Skeleton.Node>

                {/* Second paragraph */}
                <div className="mt-8">
                    <Skeleton active title={false} paragraph={{ rows: 4, width: ['100%', '100%', '100%', '55%'] }} />
                </div>

                {/* Third paragraph */}
                <div className="mt-8">
                    <Skeleton active title={false} paragraph={{ rows: 3, width: ['100%', '100%', '40%'] }} />
                </div>
            </div>
        </div>
    );
}
