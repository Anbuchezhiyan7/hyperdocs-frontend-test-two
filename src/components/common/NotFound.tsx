import React from 'react';

interface NotFoundProps {
    title?: string;
    message?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({
    title = 'Not Found',
    message = "We couldn't find what you're looking for. It might have been removed or the URL might be incorrect.",
    buttonText = 'Go Back',
    onButtonClick = () => window.history.back(),
}) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center'>
                <div className='mb-6'>
                    <svg
                        className='mx-auto h-16 w-16 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>{title}</h2>
                <p className='text-gray-600 mb-6'>{message}</p>
                <button
                    onClick={onButtonClick}
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default NotFound;
