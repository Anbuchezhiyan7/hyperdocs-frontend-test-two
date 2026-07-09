'use client';
import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { Button } from 'antd';
import { MailIcon, Settings2, CheckCircle2, Globe2, Zap, Loader2, Pencil, Power } from 'lucide-react';
import NewsletterTemplate1 from '@/components/newsletter/NewsletterTemplate1';
import NewsletterTemplate2 from '@/components/newsletter/NewsletterTemplate2';
import NewsletterConfigModal from '@/components/newsletter/NewsletterConfigModal';
import useNewsletterService from '@/services/newsletter.service';
import { NewsletterTemplateAPI } from '@/api/newsletter.api';
import { cn } from '@/utils/cn';

const TEMPLATE_META = [
    { key: 'template_1', label: 'Classic', description: 'Full-width gradient card' },
    { key: 'template_2', label: 'Split Panel', description: 'Two-column with form panel' },
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex flex-col rounded-2xl border-2 border-gray-200 overflow-hidden animate-pulse">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-28 bg-gray-200 rounded" />
                <div className="h-2.5 w-40 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
                <div className="h-7 w-16 bg-gray-200 rounded-full" />
                <div className="h-7 w-24 bg-gray-200 rounded-full" />
            </div>
        </div>
        <div className="p-6 bg-white space-y-3">
            <div className="h-6 w-2/3 bg-gray-100 rounded" />
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
            <div className="h-10 w-36 bg-gray-200 rounded-xl mt-2" />
        </div>
    </div>
);

export default function NewsletterPage() {
    const {
        templates,
        isLoadingTemplates,
        activateTemplate,
        activatingId,
        isNewsletterEnabled,
        isLoadingConfigStatus,
        isTogglingConfig,
        toggleConfigStatus,
    } = useNewsletterService();

    const [editingTemplate, setEditingTemplate] = useState<NewsletterTemplateAPI | null>(null);

    const t1 = templates.find(t => t.template_name === 'template_1');
    const t2 = templates.find(t => t.template_name === 'template_2');

    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar
                title="Newsletter"
                hideSearch
                titleIcon={<MailIcon size={20} />}
                hideBtn
                extraComponent={
                    <Button
                        danger={isNewsletterEnabled}
                        type={isNewsletterEnabled ? 'primary' : 'default'}
                        onClick={() => toggleConfigStatus(!isNewsletterEnabled)}
                        disabled={isTogglingConfig || isLoadingConfigStatus}
                        icon={isTogglingConfig ? <Loader2 size={12} className="animate-spin" /> : <Power size={12} strokeWidth={2.5} />}
                        className={!isNewsletterEnabled ? '!text-emerald-600 !border-emerald-400 hover:!border-emerald-500 hover:!text-emerald-500' : ''}
                    >
                        {isTogglingConfig ? 'Updating…' : isNewsletterEnabled ? 'Disable Newsletter' : 'Enable Newsletter'}
                    </Button>
                }
            />

            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto space-y-5">

                    {/* Info banners */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                            <Settings2 size={17} className="text-orange-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-orange-700">Global Configuration</p>
                                <p className="text-xs text-orange-500 mt-0.5">
                                    This widget is shared across all your blogs.{' '}
                                    <strong>Newsletter is disabled by default</strong> — use the button above to enable it globally.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                            <Globe2 size={17} className="text-blue-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-blue-700">Visible in all blogs</p>
                                <p className="text-xs text-blue-500 mt-0.5">
                                    The <strong>active template</strong> will automatically appear in every blog you publish. Switch anytime.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section heading */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-800">Choose a template</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Click <strong>Set as Active</strong> to make it live. Click <strong>Edit</strong> to configure a template's content.
                        </p>
                    </div>

                    {/* Skeleton while loading */}
                    {isLoadingTemplates && (
                        <div className="flex flex-col gap-6">
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    {/* Templates — vertical stack */}
                    {!isLoadingTemplates && (
                        <div className="flex flex-col gap-6">
                            {TEMPLATE_META.map(meta => {
                                const tpl = templates.find(t => t.template_name === meta.key);
                                const isActive = tpl?.is_active ?? false;
                                const isThisActivating = activatingId === tpl?.template_id;

                                return (
                                    <div
                                        key={meta.key}
                                        className={cn(
                                            'flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-300',
                                            isActive
                                                ? 'border-orange-400 shadow-lg shadow-orange-100'
                                                : 'border-gray-200 shadow-sm hover:border-orange-200 hover:shadow-md'
                                        )}
                                    >
                                        {/* Card header */}
                                        <div className={cn(
                                            'flex items-center justify-between px-4 py-3 border-b',
                                            isActive ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                                        )}>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    'text-sm font-bold',
                                                    isActive ? 'text-orange-700' : 'text-gray-700'
                                                )}>
                                                    {meta.label}
                                                </span>
                                                <span className="text-xs text-gray-400">{meta.description}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Edit button */}
                                                <button
                                                    onClick={() => tpl && setEditingTemplate(tpl)}
                                                    title="Edit template content"
                                                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap"
                                                >
                                                    <Pencil size={11} strokeWidth={2.5} />
                                                    Edit
                                                </button>

                                                {/* Active badge or Set as Active button */}
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                                                        <CheckCircle2 size={12} strokeWidth={2.5} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => tpl && activateTemplate(tpl)}
                                                        disabled={!!activatingId}
                                                        className="inline-flex items-center gap-1.5 bg-white border-2 border-orange-400 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {isThisActivating ? (
                                                            <>
                                                                <Loader2 size={11} className="animate-spin" />
                                                                Activating…
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Zap size={11} strokeWidth={2.5} />
                                                                Set as Active
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Template preview */}
                                        <div className="p-4 sm:p-6 bg-white">
                                            {meta.key === 'template_1' ? (
                                                <NewsletterTemplate1
                                                    title={t1?.title ?? 'Subscribe to Our Newsletter'}
                                                    description={t1?.description ?? 'Stay up to date with our latest news and updates.'}
                                                    buttonText={t1?.button_text ?? 'Subscribe Now'}
                                                    placeholderText="Enter your email address"
                                                    readOnly={false}
                                                />
                                            ) : (
                                                <NewsletterTemplate2
                                                    title={t2?.title ?? 'Subscribe to Our Newsletter'}
                                                    description={t2?.description ?? 'Stay up to date with our latest news and updates.'}
                                                    buttonText={t2?.button_text ?? 'Subscribe Now'}
                                                    placeholderText="Enter your email address"
                                                    rightHeading={t2?.right_panel_heading ?? 'Join our readers'}
                                                    rightSubtext={t2?.right_panel_subtext ?? 'No spam. Unsubscribe anytime.'}
                                                    readOnly={false}
                                                />
                                            )}
                                        </div>

                                        {/* Active footer note */}
                                        {isActive && (
                                            <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border-t border-orange-100">
                                                <Globe2 size={12} className="text-orange-400 shrink-0" />
                                                <p className="text-xs text-orange-600 font-medium">
                                                    This template is currently active and visible in all your blogs.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            {/* Edit modal */}
            <NewsletterConfigModal
                isOpen={!!editingTemplate}
                onClose={() => setEditingTemplate(null)}
                onSaved={() => setEditingTemplate(null)}
                activeTemplateData={editingTemplate}
            />
        </div>
    );
}
