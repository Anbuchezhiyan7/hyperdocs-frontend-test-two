import React from 'react';

interface InstructionCardProps {
    title?: string;
    recordType: string;
    name: string;
    value: string;
    ttl: string;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
    title,
    recordType,
    name,
    value,
    ttl,
}) => {
    return (
        <>
            <div className="p-[20px] flex flex-col gap-[15px] bg-[#FFF5F0] rounded-[20px]">
                <p className="text-[14px] font-[500] text-[#333] flex">
                    <span className="min-w-[120px] text-[#5D5D5D]">Record Type :</span>
                    <span>{recordType}</span>
                </p>
                <p className="text-[14px] font-[500] text-[#333] flex">
                    <span className="min-w-[120px] text-[#5D5D5D]">Name :</span>
                    <span>{name}</span>
                </p>
                <p className="text-[14px] font-[500] text-[#333] flex">
                    <span className="min-w-[120px] text-[#5D5D5D]">Value :</span>
                    <span>{value}</span>
                </p>
                <p className="text-[14px] font-[500] text-[#333] flex">
                    <span className="min-w-[120px] text-[#5D5D5D]">TTL (optional):</span>
                    <span>{ttl}</span>
                </p>
            </div>
        </>
    );
};

export default InstructionCard;
