const TemplateInfoSkeleton = () => {
    return (
        <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            {/* Thumbnail */}
            <div className="aspect-[16/10] w-full bg-[#EFEFEF]" />

            {/* Body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-2.5">
                        <div className="h-5 w-[160px] rounded-md bg-[#ECECEC]" />
                        <div className="h-3.5 w-[220px] rounded-md bg-[#F0F0F0]" />
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="h-[42px] w-[110px] rounded-lg bg-[#ECECEC]" />
                        <div className="h-[42px] w-[180px] rounded-lg bg-[#F0F0F0]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateInfoSkeleton;
