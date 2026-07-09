import Image from 'next/image';
import PublishImage from '@/assets/images/Template1.png';

const PublishContent = () => {
  return (
      <div className='flex flex-col gap-[12px] items-center px-6 py-4'>
          {/* <div className='w-full h-[200px] relative'>
              <Image
                  src={PublishImage}
                  alt='publish'
                  className='object-cover rounded-lg'
                  fill
              />
              <div className='absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent rounded-b-lg' />
          </div> */}
          <p className='text-[14px] font-[500] text-start w-full'>
              Your blog is all set to go live! Once published, it will be visible to everyone.
          </p>
          <p className='text-[14px] font-[500] text-start w-full'>
              Click <span className='text-[14px] font-[700]'>'Publish' </span>to share your
              story with the world!
          </p>
      </div>
  );
};

export default PublishContent;
