'use client';

import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { EditOulineIcon ,PlusOutlinedIcon} from '@/assets/icons';    

import InputColorPicker from '@/components/common/Input/Select/ColorPicker';
import { DeleteIcon } from '@/assets/icons';
import { getContrastTextColor } from '@/utils/color-extractor';
import { Vibrant } from 'node-vibrant/browser';
import { useAppStore } from '@/store/useAppStore';
import { showToast } from '@/components/common/Toast';

const MAX_COLORS = 6;
const COLOR_ROLES: Array<'primary' | 'secondary' | 'tertiary'> = [
    'primary',
    'secondary',
    'tertiary',
];

type ColorPaletteSelectorProps = {
    colors: string[];
    onChange: (colors: string[]) => void;
    imageUrl: string;
    error?: string;
};

const ColorPaletteSelector = ({ colors, onChange, imageUrl, error }: ColorPaletteSelectorProps) => {
    const [localColors, setLocalColors] = useState<string[]>(colors || []);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const { settings } = useAppStore();

    useEffect(() => {
        setLocalColors(colors || []);
    }, [colors]); 

    useEffect(() => {
        if (imageUrl && settings?.advanced?.logo?.url !== imageUrl) {
            const vibrant = new Vibrant(imageUrl);
            vibrant.getPalette().then(palette => {
                const colors = Object.entries(palette).map(([key, color]) => ({
                    id: key,
                    value: color?.hex || '',
                }));
                const colorValues = colors?.map(color => color?.value).filter(Boolean);
                onChange(colorValues);
                setLocalColors(colorValues);
            });
        }
    }, [imageUrl]);

    const updateColor = (index: number, newColor: string) => {
        setLocalColors(prev => prev.map((color, i) => (i === index ? newColor : color)));
    };

    const addColor = () => {
        if (localColors.length >= MAX_COLORS) {
            showToast('Maximum 6 colors are allowed', 'error');
            return;
        }
        setLocalColors(prev => [...prev, '#1B1B1B']);
    };

    const deleteColor = (index: number) => {
        setLocalColors(prev => prev.filter((_, i) => i !== index));
    };

    const saveColors = () => {
        onChange(localColors);
        setPopoverVisible(false);
    };

    const renderPopoverContent = () => (
        <div className='w-56 p-1'>
            <p className='text-base font-medium text-[#333] mb-2'>Color Palette</p>
            <div className='flex flex-col gap-1'>
                {localColors?.map((color: any, index) => (
                    <div key={color?.id || index} className='flex items-center gap-2'>
                        <InputColorPicker
                            color={color}
                            onChange={value => updateColor(index, value)}
                            className='h-8 !w-full border'
                        />
                        <DeleteIcon
                            onClick={() => deleteColor(index)}
                            className='cursor-pointer'
                            width={40}
                            height={40}
                        />
                    </div>
                ))}
            </div>
            <div className='flex items-center gap-2 mt-2'>
                {localColors.length < MAX_COLORS && (
                    <Button
                        disabled={localColors.length >= MAX_COLORS}
                        onClick={addColor}
                        type='default'
                        className='h-8 w-full font-medium'
                    >
                        Add
                    </Button>
                )}
                <Button onClick={saveColors} type='primary' className='h-8 w-full font-medium'>
                    Save
                </Button>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col gap-3 py-2'>
            <div>
                <p className='text-sm font-medium text-[#333] mb-1'>Suggested Color Palette</p>
                <p className='text-xs font-medium text-[#8F8F8F]'>
                    This color palette is generated from the logo
                </p>
            </div>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
                <div className='flex items-center rounded-md overflow-hidden border border-gray-300 divide-x divide-gray-300'>
                    {localColors?.map((color: any, index) => (
                        <div
                            key={color?.id || index}
                            className='h-8 w-24 font-medium flex-center'
                            style={{
                                backgroundColor: color?.value || color,
                                color: getContrastTextColor(color?.value || color),
                            }}
                        >
                            {typeof color === 'string'
                                ? color?.toUpperCase()
                                : color?.value?.toUpperCase()}
                        </div>
                    ))}
                </div>
                <Popover
                    content={renderPopoverContent()}
                    trigger='click'
                    placement='topRight'
                    visible={popoverVisible}
                    onVisibleChange={setPopoverVisible}
                >
                    <Button type='default' className='h-8'>
                        <span className='flex items-center gap-1'>
                            {localColors.length > 0 ? <EditOulineIcon /> : <PlusOutlinedIcon />}
                            {localColors.length > 0 ? 'Edit' : 'Add'}
                        </span>
                    </Button>
                </Popover>
            </div>
            {error && <p className='text-xs text-error text-end'>{error}</p>}
        </div>
    );
};

export default ColorPaletteSelector;
