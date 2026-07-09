import React, { useState } from 'react';
import { Button, Select, Switch } from 'antd';
import SearchInput from '@/components/common/Input/SearchInput';
import InviteMemberModal from './InviteMemberModal';

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'Project Owner' | 'Member';
    avatar: string;
}

const dummyMembers: Member[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'johndoe12@gmail.com',
        role: 'Project Owner',
        avatar: '/images/placeholder/no-image.webp',
    },
    {
        id: '2',
        name: 'Kaushik Boopathy',
        email: 'kaushikboopathy@gmail.com',
        role: 'Member',
        avatar: '/images/placeholder/no-image.webp',
    },
];

const Members = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="">
            <div className="mb-6">
                <h2 className="text-[16px] font-[700] text-[#333]">Members</h2>
                <div className="mt-4 flex items-center justify-between border-b border-[#E0E0E0] pb-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-[500] text-[#333]">
                            Invite link to add members
                        </span>
                        <small className="text-[12px] font-[500] text-[#8F8F8F]">
                            Only people with permission to invite members can see this.
                        </small>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="default"
                            className="h-[35px] border-[#E0E0E0] text-[14px] font-[500]"
                        >
                            Copy Link
                        </Button>
                        <Switch className="bg-[#8F8F8F]" />
                    </div>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <SearchInput placeholder="Search" className="h-[35px] text-[14px] w-full" />
                <Button
                    onClick={() => setIsOpen(true)}
                    type="primary"
                    className="h-[35px] bg-[#FF4D1C] text-[14px] font-[500] rounded-[10px]"
                >
                    Add New Member
                </Button>
            </div>

            <div>
                <div className="grid grid-cols-[1fr_200px] py-2">
                    <span className="text-[14px] font-[700] text-[#8F8F8F] text-start">
                        MEMBERS
                    </span>
                    <span className="text-[14px] font-[700] text-[#8F8F8F] text-start">ROLE</span>
                </div>

                {dummyMembers.map(member => (
                    <div
                        key={member.id}
                        className="grid grid-cols-[1fr_200px] items-center border-b border-[#E0E0E0] py-4"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <div className="text-[16px] font-[600] text-[#333]">
                                    {member.name}
                                </div>
                                <div className="text-[14px] font-[500] text-[#5D5D5D]">
                                    {member.email}
                                </div>
                            </div>
                        </div>
                        <Select
                            defaultValue={member.role}
                            className="w-[140px]  [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!p-2 [&_.ant-select-selection-item]:!text-[14px] [&_.ant-select-selection-item]:!font-[500] [&_.ant-select-selection-item]:!text-[#333]"
                            popupClassName="[&_.ant-select-item]:!text-[14px] [&_.ant-select-item]:!font-[500] [&_.ant-select-item]:!py-2 [&_.ant-select-item]:!px-3 [&_.ant-select-item-option-selected]:!bg-black/[0.04]"
                            options={[
                                { value: 'Project Owner', label: 'Project Owner' },
                                { value: 'Member', label: 'Member' },
                            ]}
                            suffixIcon={<span className="text-[#8F8F8F]">▼</span>}
                        />
                    </div>
                ))}
            </div>

            <InviteMemberModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export default Members;
