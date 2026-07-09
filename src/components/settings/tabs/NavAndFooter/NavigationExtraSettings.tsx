import React, { useState } from 'react';
import { PlusIcon, EditOulineIcon, DeleteOutlinedIcon } from '@/assets/icons';
import { Button, Modal, Input, ColorPicker } from 'antd';
import DeleteModal from '@/components/common/Modals/DeleteModal';
import { showToast } from '@/components/common/Toast';
import toast from 'react-hot-toast';

import { useAppStore } from '@/store/useAppStore';
import { useQueryClient } from '@tanstack/react-query';
import { 
    apiCreateHeaderCTA, 
    apiUpdateHeaderCTA, 
    apiDeleteHeaderCTA,
    apiCreateNestedMenu,
    apiUpdateNestedMenu,
    apiDeleteNestedMenu
} from '@/api/settings';

interface HeaderCTA {
    header_cta_id?: string;
    label: string;
    buttonColor: string;
    backgroundColor: string;
    url: string;
}


interface NestedMenuItem {
    label: string;
    url: string;
}

interface NestedMenu {
    menu_id: string;
    label: string;
    items: NestedMenuItem[];
}

const NavigationExtraSettings: React.FC = () => {
    const queryClient = useQueryClient();
    const { settings } = useAppStore();
    const headerCTA = settings?.navigation_footer?.headerCTA;
    const nestedMenu = settings?.navigation_footer?.nestedMenu;

    const [isCTAModalOpen, setIsCTAModalOpen] = useState(false);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isDeleteCTAModalOpen, setIsDeleteCTAModalOpen] = useState(false);
    const [isDeleteMenuModalOpen, setIsDeleteMenuModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [tempCTA, setTempCTA] = useState<HeaderCTA>({
        label: 'Get Started',
        buttonColor: '#ffffff',
        backgroundColor: '#FF5200',
        url: 'https://hyperblog.io'
    });

    const [tempMenu, setTempMenu] = useState<Omit<NestedMenu, 'menu_id'>>({
        label: 'Resources',
        items: [
            { label: 'Documentation', url: 'https://hyperblog.io' },
        ]
    });


    const [showMenuPreview, setShowMenuPreview] = useState(false);

    const saveCTA = async () => {
        if (!tempCTA.label || !tempCTA.url) {
            showToast('Label and URL are mandatory', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const res = headerCTA 
                ? await apiUpdateHeaderCTA(headerCTA.header_cta_id, tempCTA) 
                : await apiCreateHeaderCTA(tempCTA);
            
            if (res.type === 'success') {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setIsCTAModalOpen(false);
                toast.success(res?.message || 'Template selected successfully');
            } else {
                toast.error(res?.message || 'Something went wrong');
            }

        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteCTA = async () => {
        if (!headerCTA?.header_cta_id) return;
        setIsSaving(true);
        try {
            const res = await apiDeleteHeaderCTA(headerCTA.header_cta_id);
            if (res.type === 'success') {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setIsDeleteCTAModalOpen(false);
                toast.success(res?.message || 'Template selected successfully');
            } else {
                toast.error(res?.message || 'Something went wrong');
            }

        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const saveMenu = async () => {
        if (!tempMenu.label || tempMenu.items.some(item => !item.label || !item.url)) {
            showToast('Label and all item fields are mandatory', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const res = nestedMenu 
                ? await apiUpdateNestedMenu(nestedMenu.menu_id, tempMenu) 
                : await apiCreateNestedMenu(tempMenu);
            
            if (res.type === 'success') {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setIsMenuModalOpen(false);
                toast.success(res?.message || 'Template selected successfully');
            } else {
                toast.error(res?.message || 'Something went wrong');
            }

        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setIsSaving(false);
        }
    };


    const deleteMenu = async () => {
        if (!nestedMenu?.menu_id) return;
        setIsSaving(true);
        try {
            const res = await apiDeleteNestedMenu(nestedMenu.menu_id);
            if (res.type === 'success') {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setIsDeleteMenuModalOpen(false);
                toast.success(res?.message || 'Template selected successfully');
            } else {
                toast.error(res?.message || 'Something went wrong');
            }

        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const addMenuItem = () => {
        setTempMenu({
            ...tempMenu,
            items: [...tempMenu.items, { label: '', url: '' }]
        });
    };

    const updateMenuItem = (index: number, field: keyof NestedMenuItem, value: string) => {
        const newItems = [...tempMenu.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setTempMenu({ ...tempMenu, items: newItems });
    };

    const removeMenuItem = (index: number) => {
        const newItems = tempMenu.items.filter((_, i) => i !== index);
        setTempMenu({ ...tempMenu, items: newItems });
    };

    return (
        <div className="mt-8 space-y-6 px-4 pb-10">
            {/* Header CTA Section */}
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#333]">Header CTA Button</h3>
                        <p className="text-sm text-[#8F8F8F]">Add a call-to-action button to your navigation bar</p>
                    </div>
                    {!headerCTA ? (
                        <Button 
                            type="primary" 
                            loading={isSaving}
                            icon={!isSaving && <span className="text-white brightness-0 invert"><PlusIcon /></span>} 
                            onClick={() => {
                                setTempCTA({
                                    label: 'Sample CTA',
                                    buttonColor: '#ffffff',
                                    backgroundColor: '#FF5200',
                                    url: 'https://example.com/get-started'
                                });
                                setIsCTAModalOpen(true);
                            }}
                            className="bg-[#FF5200] hover:bg-[#e64a00] border-none flex items-center gap-2 h-10 px-6 rounded-lg font-semibold text-white"
                        >
                            Add CTA
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button 
                                icon={<EditOulineIcon />} 
                                onClick={() => {
                                    setTempCTA(headerCTA);
                                    setIsCTAModalOpen(true);
                                }}
                                className="flex items-center justify-center hover:text-[#FF5200] hover:border-[#FF5200]"
                            />
                            <Button 
                                icon={<DeleteOutlinedIcon />} 
                                onClick={() => setIsDeleteCTAModalOpen(true)}
                                danger
                                className="flex items-center justify-center"
                            />
                        </div>
                    )}
                </div>

                {headerCTA && (
                    <div className="flex items-center gap-6 rounded-lg bg-[#F9FAFB] p-4 border border-[#F0F0F0]">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#8F8F8F]">Preview</span>
                            <button 
                                type="button"
                                style={{ 
                                    backgroundColor: headerCTA.backgroundColor, 
                                    color: headerCTA.buttonColor 
                                }}
                                className="rounded-md px-4 py-2 text-sm font-bold shadow-sm"
                            >
                                {headerCTA.label}
                            </button>
                        </div>
                        <div className="h-10 w-[1px] bg-[#E0E0E0]" />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#8F8F8F]">URL</span>
                            <span className="text-sm font-medium text-[#FF5200] truncate max-w-[300px]">{headerCTA.url}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Menu Section */}
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#333]">Nested Menu</h3>
                        <p className="text-sm text-[#8F8F8F]">Create a dropdown menu with multiple links</p>
                    </div>
                    {!nestedMenu ? (
                        <Button 
                            type="primary" 
                            loading={isSaving}
                            icon={!isSaving && <span className="text-white brightness-0 invert"><PlusIcon /></span>} 
                            onClick={() => {
                                setTempMenu({
                                    label: 'Resources',
                                    items: [
                                        { label: 'Documentation', url: 'https://hyperblog.io' },
                                    ]
                                });

                                setIsMenuModalOpen(true);
                            }}
                            className="bg-[#FF5200] hover:bg-[#e64a00] border-none flex items-center gap-2 h-10 px-6 rounded-lg font-semibold text-white"
                        >
                            Add Nested Menu
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button 
                                icon={<EditOulineIcon />} 
                                onClick={() => {
                                    setTempMenu({
                                        label: nestedMenu.label,
                                        items: nestedMenu.items
                                    });
                                    setIsMenuModalOpen(true);
                                }}
                                className="flex items-center justify-center hover:text-[#FF5200] hover:border-[#FF5200]"
                            />
                            <Button 
                                icon={<DeleteOutlinedIcon />} 
                                onClick={() => setIsDeleteMenuModalOpen(true)}
                                danger
                                className="flex items-center justify-center"
                            />
                        </div>
                    )}
                </div>

                {nestedMenu && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#333]">{nestedMenu.label}</span>
                            <span className="text-xs text-[#8F8F8F] bg-[#F3F3F3] px-2 py-0.5 rounded-full">Dropdown</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {nestedMenu.items.map((item, idx) => (
                                <div key={idx} className="flex flex-col rounded-md border border-[#F0F0F0] bg-[#F9FAFB] px-3 py-2">
                                    <span className="text-xs font-bold text-[#333]">{item.label}</span>
                                    <span className="text-[10px] text-[#FF5200] truncate max-w-[150px]">{item.url}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Modal */}
            <Modal
                title={<span className="text-xl font-bold">Configure Header CTA</span>}
                open={isCTAModalOpen}
                onOk={saveCTA}
                onCancel={() => setIsCTAModalOpen(false)}
                okText="Save Changes"
                cancelText="Cancel"
                confirmLoading={isSaving}
                okButtonProps={{ className: 'bg-[#FF5200] hover:bg-[#e64a00]' }}
                width={500}
            >
                <div className="space-y-5 py-4">
                    {/* Live Preview Section */}
                    <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#E0E0E0] bg-[#F9FAFB] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F8F8F]">Live Preview</span>
                        <button 
                            type="button"
                            style={{ 
                                backgroundColor: tempCTA.backgroundColor, 
                                color: tempCTA.buttonColor 
                            }}
                            className="rounded-md px-6 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                            {tempCTA.label || 'Sample CTA'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#333]">Button Label*</label>
                        <Input 
                            placeholder="e.g. Get Started" 
                            value={tempCTA.label}
                            onChange={e => setTempCTA({...tempCTA, label: e.target.value})}
                            className="h-11 rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#333]">Redirect URL*</label>
                        <Input 
                            placeholder="https://example.com/get-started" 
                            value={tempCTA.url}
                            onChange={e => setTempCTA({...tempCTA, url: e.target.value})}
                            className="h-11 rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#333]">Button Color</label>
                            <div className="flex items-center gap-3 rounded-lg border border-[#d9d9d9] p-2 h-11">
                                <ColorPicker 
                                    value={tempCTA.buttonColor} 
                                    onChange={(color) => setTempCTA({...tempCTA, buttonColor: color.toHexString()})} 
                                />
                                <span className="text-sm font-medium">{tempCTA.buttonColor}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#333]">Background Color</label>
                            <div className="flex items-center gap-3 rounded-lg border border-[#d9d9d9] p-2 h-11">
                                <ColorPicker 
                                    value={tempCTA.backgroundColor} 
                                    onChange={(color) => setTempCTA({...tempCTA, backgroundColor: color.toHexString()})} 
                                />
                                <span className="text-sm font-medium">{tempCTA.backgroundColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Nested Menu Modal */}
            <Modal
                title={<span className="text-xl font-bold">Configure Nested Menu</span>}
                open={isMenuModalOpen}
                onOk={saveMenu}
                onCancel={() => {
                    setIsMenuModalOpen(false);
                    setShowMenuPreview(false);
                }}
                okText="Save Changes"
                cancelText="Cancel"
                confirmLoading={isSaving}
                okButtonProps={{ className: 'bg-[#FF5200] hover:bg-[#e64a00]' }}
                width={600}
            >
                <div className="space-y-5 py-4 max-h-[calc(100vh-270px)] overflow-y-auto thin-scrollbar px-1">
                    <div className="flex justify-end">
                        <button 
                            type="button"
                            onClick={() => setShowMenuPreview(!showMenuPreview)}
                            className="text-[#FF5200] font-semibold underline hover:text-[#e64a00] transition-colors text-sm"
                        >
                            {showMenuPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    </div>

                    {/* Live Preview Section */}
                    {showMenuPreview && (
                        <div className="p-8 rounded-xl border-2 border-dashed border-[#E0E0E0] bg-[#F9FAFB] flex flex-col items-center animate-in fade-in duration-300">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F8F8F] mb-4">Live Preview</span>
                            <div className="relative group cursor-default">
                                {/* Main Label */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#F3F3F3] transition-colors">
                                    <span className="text-sm font-bold text-[#333]">{tempMenu.label || 'Dropdown Name'}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                
                                {/* Dropdown Items */}
                                <div className="mt-1 w-48 rounded-lg border border-[#F0F0F0] bg-white shadow-lg overflow-hidden py-1 max-h-48 overflow-y-auto thin-scrollbar">
                                    {tempMenu.items.length > 0 ? (
                                        tempMenu.items.map((item, idx) => (
                                            <div key={idx} className="px-4 py-2 hover:bg-[#FF5200]/5 hover:pl-6 transition-all duration-200 cursor-pointer group/item">
                                                <span className="text-xs font-semibold text-[#333] group-hover/item:text-[#FF5200] transition-colors block">{item.label || 'Item Label'}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-center">
                                            <span className="text-[10px] text-[#8F8F8F] italic">No items added yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#333]">Menu Label*</label>
                        <Input 
                            placeholder="e.g. Resources" 
                            value={tempMenu.label}
                            onChange={e => setTempMenu({...tempMenu, label: e.target.value})}
                            className="h-11 rounded-lg"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-[#333]">Menu Items*</label>
                            <Button 
                                type="dashed" 
                                icon={<PlusIcon />} 
                                onClick={addMenuItem}
                                className="flex items-center gap-1"
                            >
                                Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {tempMenu.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border border-[#F0F0F0] bg-[#F9FAFB] relative group">
                                    <div className="flex-1 space-y-3">
                                        <Input 
                                            placeholder="Item Label" 
                                            value={item.label}
                                            onChange={e => updateMenuItem(idx, 'label', e.target.value)}
                                            className="h-10 rounded-lg"
                                        />
                                        <Input 
                                            placeholder="Item URL" 
                                            value={item.url}
                                            onChange={e => updateMenuItem(idx, 'url', e.target.value)}
                                            className="h-10 rounded-lg"
                                        />
                                    </div>
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={<DeleteOutlinedIcon />} 
                                        onClick={() => removeMenuItem(idx)}
                                        className="mt-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* CTA Delete Confirmation Modal */}
            <DeleteModal
                open={isDeleteCTAModalOpen}
                onClose={() => setIsDeleteCTAModalOpen(false)}
                onAccept={deleteCTA}
                title="Delete Header CTA"
                description="Are you sure you want to remove this CTA button? This action cannot be undone."
                isLoading={isSaving}
            />

            {/* Menu Delete Confirmation Modal */}
            <DeleteModal
                open={isDeleteMenuModalOpen}
                onClose={() => setIsDeleteMenuModalOpen(false)}
                onAccept={deleteMenu}
                title="Delete Nested Menu"
                description="Are you sure you want to remove this nested menu? This action cannot be undone."
                isLoading={isSaving}
            />
        </div>
    );
};

export default NavigationExtraSettings;
