import { Button } from 'antd';
import Link from 'next/link';

export default function DomainError () {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center'>
                <div className='mb-6'>
                    <svg
                        className='mx-auto h-16 w-16 text-red-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                        />
                    </svg>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Domain Not Configured</h2>
                <p className='text-gray-600 mb-6'>
                    Your domain settings need to be configured. Please check your domain dashboard
                    settings to ensure everything is set up correctly.
                </p>
                <div className='flex flex-row gap-2 justify-center'>
                    <Link href='/login'>
                        <Button type='primary' className='w-full'>
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Button type='primary' onClick={handleRefresh} className='w-full'>
                        Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
}
