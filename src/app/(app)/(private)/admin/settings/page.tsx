import { redirect } from 'next/navigation';

const SettingsPage = () => {
    redirect('/admin/settings/general');
};

export default SettingsPage;
