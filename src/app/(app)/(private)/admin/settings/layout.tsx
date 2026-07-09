import React from 'react';
import SettingsShell from '@/components/settings/partials/SettingsShell';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return <SettingsShell>{children}</SettingsShell>;
};

export default SettingsLayout;
