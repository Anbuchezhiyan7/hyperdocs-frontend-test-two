import { MainLayout } from '@/components/layouts';
import AddEditAuthorModal from '@/components/settings/tabs/Author/AddEditAuthorModal';
import ViewAuthorModal from '@/components/settings/tabs/Author/ViewAuthorModal';
import { AuthProvider } from '@/providers/auth.provider';

export default function Layout ({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MainLayout>
                <AddEditAuthorModal />
                <ViewAuthorModal />
                {children}
            </MainLayout>
        </AuthProvider>
    );
}
