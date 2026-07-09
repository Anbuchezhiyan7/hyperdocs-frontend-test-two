import Image from 'next/image';
import { Button, ColorPicker } from 'antd';
import { EyeOutlineIcon } from '@/assets/icons';
import { useTemplateService } from '@/services/template.service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth.provider';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useAppStore } from '@/store/useAppStore';

const DEFAULT_TEMPLATE3_BG = '#F4EFE8';

interface TemplateInfoProps {
    data: any;
}

const TemplateInfo = ({ data }: TemplateInfoProps) => {
    const { handleSelectTemplate, isCreating, handleUpdateTemplate, isUpdating } =
        useTemplateService();
    const { setTemplateData } = useTemplateStore();
    const { settings } = useAppStore();
    const { user } = useAuth();
    const router = useRouter();

    const isTemplate3 = data?.template_tag === 'template_003';
    const savedColor = data?.bg_color || DEFAULT_TEMPLATE3_BG;
    const [draftColor, setDraftColor] = useState<string>(savedColor);
    const isDirty = draftColor.toLowerCase() !== savedColor.toLowerCase();

    const handleSaveBgColor = () => {
        handleUpdateTemplate({
            template_id: data?.template_id,
            payload: {
                template_name: data?.template_name,
                template_tag: data?.template_tag,
                template_description: data?.template_description,
                is_active: data?.is_active,
                thumbnail: data?.thumbnail,
                bg_color: draftColor,
            },
        });
    };

 const handlePreview = () => {
    Cookies.set('user_id', user?.user_id);
    setTemplateData('template', { ...settings, bg_color: savedColor });
    const url = `/admin/template/${data?.template_tag}?mode=preview`;
    window.open(url, '_blank');
};
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E0E0E0] hover:shadow-[0_12px_32px_rgba(16,24,40,0.10)]">
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F4F4F4]">
                <Image
                    src={data?.thumbnail}
                    alt="template"
                    fill
                    sizes="(max-width: 1280px) 100vw, 640px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {data?.is_active && (
                    <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#D6F5DD] px-3 py-1 text-[12px] font-[600] text-[#1E8E3E] shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1E8E3E]" />
                        Active Now
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <h1 className="text-[18px] font-[700] capitalize text-[#0F0F0F]">
                            {data?.template_name.replaceAll('_', ' ')}
                        </h1>
                        <p className="text-[14px] font-[500] leading-relaxed text-[#7A7A7A]">
                            {data?.template_description}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <Button
                            type="default"
                            className="flex h-[42px] items-center gap-2 rounded-lg border-[#E0E0E0] font-[600] text-[#1A1A1A]"
                            icon={<EyeOutlineIcon />}
                            onClick={handlePreview}
                        >
                            Preview
                        </Button>
                        {data?.is_active ? (
                            <span className="flex h-[42px] items-center justify-center rounded-lg bg-[#F2FBF4] px-6 text-[14px] font-[600] text-[#1E8E3E]">
                                Currently Active
                            </span>
                        ) : (
                            <Button
                                loading={isCreating}
                                type="primary"
                                className="h-[42px] rounded-lg border-none bg-[#FF4405] px-8 font-[600] shadow-[0_4px_12px_rgba(255,68,5,0.24)]"
                                onClick={() =>
                                    handleSelectTemplate({ template_tag: data?.template_tag })
                                }
                            >
                                Use This Template
                            </Button>
                        )}
                    </div>
                </div>

                {isTemplate3 && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                        <span className="text-[13px] font-[600] text-[#5D5D5D]">Background</span>
                        <ColorPicker
                            value={draftColor}
                            disabledAlpha
                            format="hex"
                            disabled={isUpdating}
                            onChange={(_, hex) => setDraftColor(hex)}
                            showText
                        />
                        <Button
                            type="primary"
                            size="small"
                            className="ml-auto h-[34px] bg-[#FF4405]"
                            loading={isUpdating}
                            disabled={!isDirty}
                            onClick={handleSaveBgColor}
                        >
                            Save
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TemplateInfo;
