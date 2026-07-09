'use client';

import React, { useState } from 'react';
import CenteredModal from '@/components/common/Modals/CenteredModal';

import { Input, Select } from 'antd';
import Button from '@/components/common/Buttons';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Project Owner');

    const handleSendInvite = () => {
        console.log('Sending invite to:', email, 'with role:', role);
        onClose();
    };

    const CustomHeader = () => (
        <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-[700]">Invite members</h1>
            <p className="text-[14px] font-[500] text-[#8F8F8F]">
                Type or paste in emails below, separated by commas
            </p>
        </div>
    );

    const CustomFooter = () => (
        <Button type="primary" onClick={handleSendInvite} className="w-full h-[32px] rounded-xl mb-2">
            Send Invite
        </Button>
    );

    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={onClose}
            headerComponent={<CustomHeader />}
            hideFooter={false}
            footerComponent={<CustomFooter />}
            hideDivider={true}
            height={400}
            childrenClassName="h-fit py-2"
        >
            <div className="flex flex-col gap-3 ">
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-[400] text-[#333]">Email addresses</label>
                    <Input
                        placeholder="Type or paste in emails below, separated by commas"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="rounded-xl"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-[400] text-[#333]">Role</label>
                    <Select
                        defaultValue="Project Owner"
                        onChange={setRole}
                        className="w-full rounded-xl"
                        options={[
                            { value: 'Project Owner', label: 'Project Owner' },
                            { value: 'Member', label: 'Member' },
                        ]}
                    />
                </div>
            </div>
        </CenteredModal>
    );
};

export default InviteMemberModal;
