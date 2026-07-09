'use client';

import React, { useState } from 'react';
import { Input } from 'antd';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import Button from '@/components/common/Buttons';
import { showToast } from '@/components/common/Toast';
import { useSendData } from '@/config/query.config';
import { useAppStore } from '@/store/useAppStore';
import { getCookie } from '@/utils/cookie';
import membersApi from '@/api/members.api';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const { user } = useAppStore();
    const ownEmail = (user?.email || getCookie('email') || '').trim().toLowerCase();

    const handleClose = () => {
        setEmail('');
        onClose();
    };

    const { mutate: sendInvite, isPending } = useSendData<string>({
        fn: (value: string) => membersApi.handleInviteMember(value),
        success: () => {
            showToast('Invite sent successfully', 'success');
            handleClose();
        },
        error: (err: any) => {
            showToast(
                err?.data?.detail || err?.message || 'Failed to send invite',
                'error'
            );
        },
        invalidateKey: ['members'],
    });

    const handleSendInvite = () => {
        const value = email.trim();
        if (!EMAIL_REGEX.test(value)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        if (ownEmail && value.toLowerCase() === ownEmail) {
            showToast('You cannot invite yourself', 'error');
            return;
        }
        sendInvite(value);
    };

    const CustomHeader = () => (
        <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-[700] text-[#333]">Invite team member</h1>
            <p className="text-[14px] font-[500] text-[#8F8F8F]">
                Send an invitation by email. They&apos;ll get a link to join your workspace.
            </p>
        </div>
    );

    const CustomFooter = () => (
        <div className="flex items-center justify-end gap-2">
            <Button
                type="default"
                onClick={handleClose}
                disabled={isPending}
                className="h-9 rounded-xl border-[#E0E0E0] text-[14px] font-[500]"
            >
                Cancel
            </Button>
            <Button
                type="primary"
                onClick={handleSendInvite}
                loading={isPending}
                className="h-9 rounded-xl bg-[#FF4D1C] text-[14px] font-[500]"
            >
                Send invite
            </Button>
        </div>
    );

    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={handleClose}
            headerComponent={<CustomHeader />}
            footerComponent={<CustomFooter />}
            hideDivider
            height={280}
            childrenClassName="h-fit py-2"
        >
            <div className="flex flex-col gap-1">
                <label className="text-[14px] font-[600] text-[#333]">Email address</label>
                <Input
                    type="email"
                    placeholder="teammate@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onPressEnter={handleSendInvite}
                    className="h-10 rounded-xl"
                    autoFocus
                />
            </div>
        </CenteredModal>
    );
};

export default InviteMemberModal;
