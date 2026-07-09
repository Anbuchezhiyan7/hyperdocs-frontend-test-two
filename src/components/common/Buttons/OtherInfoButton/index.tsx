import React from 'react';
import { Button } from 'antd';
import { RightArrow, TickIcon } from '@/assets/icons/index';

interface OtherInfoButtonProps {
    done?: boolean;
    content?: string;
}

const OtherInfoButton: React.FC<OtherInfoButtonProps> = ({
    done = true,
    content = 'Set Custom Metadata',
}) => {
    return (
        
            <Button size='large' className="flex min-h-[50px] px-4 items-center self-stretch rounded-[14px] border-[1.5px] border-[#E0E0E0] bg-white">
                <div className="flex items-center">
                    {done && <TickIcon className="h-6 w-6 mr-3" />}
                    <span className="text-base font-semibold">{content}</span>
                </div>
                <div className="ml-auto">
                    <RightArrow className="h-6 w-6" />
                </div>
            </Button>
       
    );
};

export default OtherInfoButton;
