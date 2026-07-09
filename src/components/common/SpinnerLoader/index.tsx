import { Spin } from 'antd';

export default function SpinnerLoader () {
    return (
        <div className='fixed top-0 left-0 z-50 w-full h-full backdrop-blur-lg flex items-center justify-center'>
            <Spin size='large' />
        </div>
    );
}