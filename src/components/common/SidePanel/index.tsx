import React, { ReactNode } from 'react';
import { Drawer, Divider } from 'antd';
import { CloseOutlinedIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface RightPannelProps {
    header: string;
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    childrenClassName?: string;
    bodyClassName?: string;
    headerStyle?: React.CSSProperties;
    headerTextStyle?: React.CSSProperties;
}

const RightPannel: React.FC<RightPannelProps> = ({
    header,
    open,
    onClose,
    children,
    bodyClassName = '',
    childrenClassName = '',
    headerStyle,
    headerTextStyle,
}) => {
    const CustomHeader = (
        <div className="pt-6 relative ">
            <p className="text-lg font-semibold ml-6 w-fit">{header}</p>

            <span
                className="absolute right-6 bottom-2 -translate-y-1/2 cursor-pointer "
                onClick={onClose}
            >
                <CloseOutlinedIcon />
            </span>
            <Divider className="mt-4 mb-0 bg-[#E0E0E0]" />
        </div>
    );

    return (
        <Drawer
            title={CustomHeader}
            placement="right"
            onClose={onClose}
            open={open}
            width={400}
            height="70vh"
            closable={false}
            className={cn('drawer-custom', bodyClassName)}
            styles={{
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.25)' },
                wrapper: { marginRight: '24px', marginTop: '7vh', marginBottom: '5vh' },
                content: { borderRadius: '12px' },
                header: {
                    padding: 0,
                    border: 'none',
                },
                body: { padding: '20px' },
            }}
        >
            <div className={cn('flex flex-col space-y-4', childrenClassName)}>{children}</div>
        </Drawer>
    );
};

export default RightPannel;
