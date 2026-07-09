import { CheckCircleFilledIcon } from '@/assets/icons'; 
import { ArrowRightCircle } from '@/assets/icons'; 

type Props = {
    isChecked?: boolean;
    title: string;
    onClick?: () => void;
    required?: boolean;
};

const InfoCard = (props: Props) => {
    return (
        <div
            onClick={props.onClick}
            className={`bg-white flex items-center justify-between border-stroke border-2 p-1 px-4 text-black font-medium text-[0.8rem] capitalize rounded-xl py-2 hover:bg-gray-50 cursor-pointer active:scale-95 transition-all duration-300`}
        >
            <div className='flex items-center gap-2'>
                {props.isChecked && <CheckCircleFilledIcon/>}
                <p className='text-sm font-semibold truncate'>{props.title}</p>
            {props.required && <p className='text-red-500 text-xs lowercase'>(required)</p>}
            </div>
            <ArrowRightCircle />
        </div>
    );
};

export default InfoCard;
