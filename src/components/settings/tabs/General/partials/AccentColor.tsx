import InputColorPicker from '@/components/common/Input/Select/ColorPicker';

type AccentColorType = {
    color: string;
    setColor: (color: string) => void;
    error: any;
    required?: boolean;
};

const AccentColor = ({ color, setColor, error, required }: AccentColorType) => {
    return (
        <div className='flex flex-col gap-[8px] border-b border-[#E0E0E0] pb-4'>
            <div className='flex flex-col gap-2 items-start'>
                <h3 className='text-sm font-medium text-[#333] m-0'>
                    Accent Colour
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </h3>
                <div className='flex items-center gap-2'>
                    <InputColorPicker color={color} onChange={val => setColor(val)} />
                </div>
                <p className='text-xs font-medium text-[#8F8F8F]'>
                    This color will be used to theme the buttons, form elements, links, etc. This is
                    your current selection.
                </p>
            </div>
            {error && <p className='text-xs text-error'>{error}</p>}
        </div>
    );
};

export default AccentColor;
