'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import membersApi from '@/api/members.api';
import { useSendData } from '@/config/query.config';
import { showToast } from '@/components/common/Toast';
import Button from '@/components/common/Buttons';
import DeleteModal from '@/components/common/Modals/DeleteModal';
import { MembersIcon, TrashIcon } from '@/assets/icons';
import { getIsOwner } from '@/utils/auth';
import type { TeamMember, TeamMemberStatus } from '@/interface/settings';
import InviteMemberModal from './InviteMemberModal';
import InviteSkeleton from './InviteSkeleton';

const formatDate = (iso?: string | null) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const STATUS_STYLES: Record<
    TeamMemberStatus,
    { label: string; className: string; dot: string }
> = {
    pending: { label: 'Pending', className: 'bg-[#FFF3E9] text-[#FF8A3C]', dot: 'bg-[#FF8A3C]' },
    completed: { label: 'Accepted', className: 'bg-[#E9F9EF] text-[#28A745]', dot: 'bg-[#28A745]' },
    revoked: { label: 'Revoked', className: 'bg-[#F2F2F2] text-[#8F8F8F]', dot: 'bg-[#8F8F8F]' },
};

const StatusBadge = ({ status }: { status: TeamMemberStatus }) => {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 justify-self-start rounded-full px-2.5 py-0.5 text-[12px] font-[600] ${style.className}`}
        >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
};

const Invite = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [memberToRevoke, setMemberToRevoke] = useState<TeamMember | null>(null);
    const isOwner = getIsOwner();

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: () => membersApi.handleGetMembers(),
    });

    const members: TeamMember[] = data?.members ?? [];

    const { mutate: revokeMember, isPending: isRevoking } = useSendData<string>({
        fn: (inviteId: string) => membersApi.handleRevokeMember(inviteId),
        success: () => {
            showToast('Member access revoked successfully', 'success');
            setMemberToRevoke(null);
        },
        error: (err: any) =>
            showToast(err?.data?.detail || err?.message || 'Failed to revoke member', 'error'),
        invalidateKey: ['members'],
    });

    if (isLoading) {
        return <InviteSkeleton />;
    }

    const gridCols = isOwner
        ? 'grid-cols-[1fr_140px_140px_140px_48px]'
        : 'grid-cols-[1fr_140px_140px_140px]';

    return (
        <div className="w-full max-w-[1200px] mx-auto">
            <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-base font-bold text-[#333]">Team Members</h2>
                    <p className="text-sm font-medium text-[#5D5D5D]">
                        Invite teammates and manage who has access to your workspace.
                    </p>
                </div>
                {isOwner && (
                    <Button
                        type="primary"
                        onClick={() => setIsOpen(true)}
                        className="flex h-9 items-center gap-1 rounded-[10px] bg-[#FF4D1C] text-[14px] font-[600]"
                    >
                        <span className="text-[16px] leading-none">+</span>
                        Invite member
                    </Button>
                )}
            </div>

            <div className="rounded-xl border border-[#E0E0E0]">
                {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F2F2] text-[#8F8F8F] [&_svg]:h-5 [&_svg]:w-5">
                            <MembersIcon />
                        </span>
                        <h3 className="text-[16px] font-[700] text-[#333]">No team members yet</h3>
                        <p className="max-w-[280px] text-[14px] font-[500] text-[#8F8F8F]">
                            Invite your teammates by email to collaborate in this workspace.
                        </p>
                        {isOwner && (
                            <Button
                                type="primary"
                                onClick={() => setIsOpen(true)}
                                className="mt-1 flex h-9 items-center gap-1 rounded-[10px] bg-[#FF4D1C] text-[14px] font-[600]"
                            >
                                <span className="text-[16px] leading-none">+</span>
                                Invite member
                            </Button>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className={`grid ${gridCols} items-center border-b border-[#E0E0E0] bg-[#FAFAFA] px-5 py-3`}>
                            <span className="text-[12px] font-[700] uppercase tracking-wider text-[#8F8F8F]">
                                Member
                            </span>
                            <span className="text-[12px] font-[700] uppercase tracking-wider text-[#8F8F8F]">
                                Status
                            </span>
                            <span className="text-[12px] font-[700] uppercase tracking-wider text-[#8F8F8F]">
                                Invited
                            </span>
                            <span className="text-[12px] font-[700] uppercase tracking-wider text-[#8F8F8F]">
                                Joined
                            </span>
                            {isOwner && <span />}
                        </div>

                        {members.map(member => (
                            <div
                                key={member.invite_id}
                                className={`grid ${gridCols} items-center border-b border-[#E0E0E0] px-5 py-4 last:border-b-0`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#38A6F0] text-[14px] font-[600] uppercase text-white">
                                        {member.invited_email?.charAt(0) || '?'}
                                    </span>
                                    <span className="text-[14px] font-[500] text-[#333]">
                                        {member.invited_email}
                                    </span>
                                </div>
                                <StatusBadge status={member.status} />
                                <span className="text-[14px] font-[500] text-[#5D5D5D]">
                                    {formatDate(member.created_at)}
                                </span>
                                <span className="text-[14px] font-[500] text-[#5D5D5D]">
                                    {formatDate(member.accepted_at)}
                                </span>
                                {isOwner &&
                                    (member.status === 'revoked' ? (
                                        <button
                                            type="button"
                                            disabled
                                            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md text-[#CFCFCF] opacity-50"
                                            aria-label="Revoke member"
                                        >
                                            <TrashIcon />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setMemberToRevoke(member)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#8F8F8F] transition-colors hover:bg-[#F2F2F2] hover:text-[#FF4D1C]"
                                            aria-label="Revoke member"
                                        >
                                            <TrashIcon />
                                        </button>
                                    ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <InviteMemberModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

            <DeleteModal
                open={!!memberToRevoke}
                title="Revoke access?"
                description={`${memberToRevoke?.invited_email || 'This member'} will lose access to this workspace immediately.`}
                isLoading={isRevoking}
                onClose={() => setMemberToRevoke(null)}
                onAccept={() => memberToRevoke && revokeMember(memberToRevoke.invite_id)}
            />
        </div>
    );
};

export default Invite;
