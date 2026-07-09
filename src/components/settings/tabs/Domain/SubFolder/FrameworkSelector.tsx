'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import wordpressImg from '@/assets/images/wordpress.png';
import nextjsImg from '@/assets/images/nextjs.png';
import Image from 'next/image';

interface FrameworkSelectorProps {
    selected: 'wordpress' | 'nextjs' | null;
    onSelect: (framework: 'wordpress' | 'nextjs') => void;
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-8 mb-12">
                {/* WordPress Card */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect('wordpress')}
                    className={cn(
                        "w-[200px] h-[200px] flex flex-col items-center justify-center gap-4 rounded-3xl cursor-pointer transition-all duration-300",
                        "border-2 bg-white shadow-xl",
                        selected === 'wordpress' 
                            ? "border-[#FF5200] shadow-[#FF52001A]" 
                            : "border-gray-100 hover:border-gray-300"
                    )}
                >
                    <div className="p-4 bg-gray-50 rounded-2xl w-24 h-24 flex items-center justify-center">
                        <Image src={wordpressImg} alt="WordPress" width={60} height={60} />
                    </div>
                    <span className={cn(
                        "text-[18px] font-semibold",
                        selected === 'wordpress' ? "text-[#FF5200]" : "text-gray-700"
                    )}>
                        WordPress
                    </span>
                </motion.div>

                {/* Next.js Card */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect('nextjs')}
                    className={cn(
                        "w-[200px] h-[200px] flex flex-col items-center justify-center gap-4 rounded-3xl cursor-pointer transition-all duration-300",
                        "border-2 bg-white shadow-xl",
                        selected === 'nextjs' 
                            ? "border-[#FF5200] shadow-[#FF52001A]" 
                            : "border-gray-100 hover:border-gray-300"
                    )}
                >
                    <div className="p-4 bg-gray-50 rounded-2xl w-24 h-24 flex items-center justify-center">
                        <Image src={nextjsImg} alt="Next.js" width={60} height={60} />
                    </div>
                    <span className={cn(
                        "text-[18px] font-semibold",
                        selected === 'nextjs' ? "text-[#FF5200]" : "text-gray-700"
                    )}>
                        Next.js
                    </span>
                    {selected === 'nextjs' && (
                         <motion.div 
                            layoutId="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4"
                        >
                            {/* <CheckCircle2 className="w-6 h-6 text-[#FF5200]" /> */}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default FrameworkSelector;
