import EditorNavbar from '@/components/editor/layout/EditorNavbar';
import { AuthProvider } from '@/providers/auth.provider';
export default function EditorLayout ({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <EditorNavbar />
            <div className='flex flex-col h-[calc(100vh-70px)] w-screen '>{children}</div>
        </AuthProvider>
    );
}
