import { useAppStore } from '@/store/useAppStore';
import React from 'react';
import Link from 'next/link';
import { Globe, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

const ConnectView: React.FC<{ connected: boolean }> = ({ connected }) => {
    const { settings } = useAppStore();

    const getDomain = () => {
        if (settings.domain.main_domain) {
            return settings.domain.main_domain;
        } else if (settings.domain.sub_domain) {
            return settings.domain.sub_domain;
        } else if ((settings.domain as any).sub_folder_connected && (settings.domain as any).sub_folder_domain) {
            return `${(settings.domain as any).sub_folder_domain}/${settings.domain.sub_folder?.replace(/^\/+/, '')}`;
        } else if (settings.domain.sub_folder) {
            return settings.domain.sub_folder;
        } else if (settings.domain.default) {
            return settings.domain.default;
        }
        return '';
    };

    const domain = getDomain();
    const hasDomain = domain && domain.trim().length > 0;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-sm p-5 mb-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-11 h-11 rounded-xl shadow-sm ${connected ? 'bg-green-50' : 'bg-red-50'}`}>
                        <Globe size={20} className={connected ? 'text-green-600' : 'text-red-400'} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Blog Address</p>
                        {hasDomain ? (
                            <Link
                                href={`https://${domain}`}
                                target="_blank"
                                className="flex items-center gap-1.5 text-[15px] font-bold text-[#FF5200] hover:text-[#E64A00] transition-colors"
                            >
                                https://{domain}
                                <ExternalLink size={13} />
                            </Link>
                        ) : (
                            <span className="text-[14px] font-semibold text-gray-400">No domain connected</span>
                        )}
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider border ${
                    connected
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-500 border-red-200'
                }`}>
                    {connected ? (
                        <CheckCircle2 size={14} className="text-green-600" />
                    ) : (
                        <XCircle size={14} className="text-red-400" />
                    )}
                    {connected ? 'Connected' : 'Not Connected'}
                </div>
            </div>
        </div>
    );
};

export default ConnectView;
