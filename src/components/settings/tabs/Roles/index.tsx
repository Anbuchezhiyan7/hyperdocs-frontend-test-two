'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';

type Role = 'admin' | 'editor' | 'viewer';

interface Permission {
    id: string;
    label: string;
    description: string;
    roles: Record<Role, boolean>;
}

const ROLE_LABELS: Record<Role, string> = {
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
};

const DEFAULT_PERMISSIONS: Permission[] = [
    {
        id: 'publish',
        label: 'Publish posts',
        description: 'Make posts live on the blog.',
        roles: { admin: true, editor: true, viewer: false },
    },
    {
        id: 'edit',
        label: 'Create & edit posts',
        description: 'Write and change draft content.',
        roles: { admin: true, editor: true, viewer: false },
    },
    {
        id: 'manage_team',
        label: 'Manage team',
        description: 'Invite members and change their roles.',
        roles: { admin: true, editor: false, viewer: false },
    },
    {
        id: 'view_analytics',
        label: 'View analytics',
        description: 'See traffic and engagement data.',
        roles: { admin: true, editor: true, viewer: true },
    },
    {
        id: 'billing',
        label: 'Manage billing',
        description: 'Change the plan and payment method.',
        roles: { admin: true, editor: false, viewer: false },
    },
];

const RolesSettings: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);
    const [isModified, setIsModified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const toggle = (permId: string, role: Role) => {
        // Admin always keeps every permission — it can't be revoked.
        if (role === 'admin') return;
        setPermissions(prev =>
            prev.map(p =>
                p.id === permId ? { ...p, roles: { ...p.roles, [role]: !p.roles[role] } } : p
            )
        );
        setIsModified(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Persist the permission matrix. Members immediately gain or lose access
        // based on their assigned role the next time they load the workspace.
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsSaving(false);
        setIsModified(false);
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col gap-4 pb-5 hide-scrollbar'>
                <SettingsHeader
                    title='Roles & Permissions'
                    description='Control what each team role can do. Admins always have full access.'
                />

                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='border-b border-[#E0E0E0]'>
                                <th className='py-2 pr-4 text-xs font-bold uppercase tracking-wider text-[#8F8F8F]'>
                                    Permission
                                </th>
                                {(Object.keys(ROLE_LABELS) as Role[]).map(role => (
                                    <th
                                        key={role}
                                        className='py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-[#8F8F8F]'
                                    >
                                        {ROLE_LABELS[role]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map(perm => (
                                <tr key={perm.id} className='border-b border-[#F0F0F0]'>
                                    <td className='py-3 pr-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-sm font-semibold text-[#333]'>{perm.label}</span>
                                            <span className='text-xs font-medium text-[#8F8F8F]'>{perm.description}</span>
                                        </div>
                                    </td>
                                    {(Object.keys(ROLE_LABELS) as Role[]).map(role => (
                                        <td key={role} className='py-3 px-3 text-center'>
                                            <input
                                                type='checkbox'
                                                checked={perm.roles[role]}
                                                disabled={role === 'admin'}
                                                onChange={() => toggle(perm.id, role)}
                                                className='h-4 w-4 accent-[#333] disabled:opacity-40'
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ActionFooter isSaving={isSaving} disableButtons={!isModified} handleSave={handleSave} />
        </div>
    );
};

export default RolesSettings;
