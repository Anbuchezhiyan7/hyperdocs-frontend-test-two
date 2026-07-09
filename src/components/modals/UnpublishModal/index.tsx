import React from 'react';
import CenterModal from '../CenterModal';
import Image from 'next/image';
import { Template1 } from '@/assets/images';
interface UnpublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogTitle: string;
    onUnpublish: () => void;
}

const UnpublishModal: React.FC<UnpublishModalProps> = ({
    isOpen,
    onClose,
    blogTitle,
    onUnpublish,
}) => {
    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}

            width={500}
            footerComponent={
                <div className="flex gap-3  w-full">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-[10px] hover:bg-gray-50 w-full "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onUnpublish}
                        className="px-4 py-2 text-white bg-[#DC3545] rounded-[10px] hover:bg-[#DC3545] w-full"
                    >
                        Unpublish
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center p-4 w-full">
                <h2 className="text-[20px] text-[#333] mb-4 text-start w-full font-[700]">
                    Unpublish Blog?
                </h2>

                <div className="w-full max-w-[300px] h-[150px] relative mb-4">
                    <Image
                        src={Template1}
                        alt={blogTitle}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent " />
                </div>

                <p className="text-start w-full text-[#333] mb-4 text-[14px] font-[500]">
                    Are you sure you want to unpublish this blog? It will no longer be visible to
                    the public. You can republish it anytime.
                </p>

                <ul className="text-[#333] text-[14px]  w-full font-[500]">
                    <li>• Your content will be saved as a draft.</li>
                    <li>• Links to this blog may no longer work.</li>
                </ul>
            </div>
        </CenterModal>
    );
};

export default UnpublishModal;
