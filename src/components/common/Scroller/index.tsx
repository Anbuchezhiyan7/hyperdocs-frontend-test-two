import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollerProps {
    handlePrevious: () => void;
    handleNext: () => void;
}

const Scroller: React.FC<ScrollerProps> = ({ handlePrevious, handleNext }) => {
    return (
        <div className='flex space-x-2'>
            <button
                onClick={handlePrevious}
                className='p-1 rounded-full border border-border hover:bg-gray-100 transition-colors'
                aria-label='Previous slide'
            >
                <ChevronLeft className='h-5 w-5' />
            </button>
            <button
                onClick={handleNext}
                className='p-1 rounded-full border border-border hover:bg-gray-100 transition-colors'
                aria-label='Next slide'
            >
                <ChevronRight className='h-5 w-5' />
            </button>
        </div>
    );
};

export default Scroller;
