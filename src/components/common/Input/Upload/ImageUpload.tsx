// import React from 'react';
// import Image from 'next/image';
// import { BiPlus } from 'react-icons/bi';
// import { MdChangeCircle, MdDelete } from 'react-icons/md';
// import { IoCloseCircle } from 'react-icons/io5';
// import { usePathname } from 'next/navigation';
// import { cn } from '@/utils/cn';
// import { Button } from 'antd';

// const ImageUpload: React.FC<BaseUploaderProps> = ({ ...props }) => {
//     const { value = [], maxFiles = 1, disabled = false, handleRemove, handleClick } = props;
//     console.log(props.fileType, 'value for image upload');
//     const pathname = usePathname();
//     const isCommunity = pathname.includes('community');

//     return (
//         <div
//             className={cn(
//                 'flex w-full flex-wrap gap-4',
//                 props.variant === 'cover-image' ? '!h-[250px]' : ''
//             )}
//         >
//             {Array.isArray(value) &&
//                 value.map((file, index) => (
//                     <div
//                         key={index}
//                         className={cn(
//                             'relative flex items-center justify-center group rounded-lg ',
//                             props.variant === 'cover-image'
//                                 ? 'h-[250px] active:!scale-100 w-full'
//                                 : 'h-24 w-24'
//                         )}
//                     >
//                         <div className='relative w-full h-full'>
//                             {maxFiles > 1 && file.url ? (
//                                 <span
//                                     // @ts-ignore
//                                     onClick={() => handleRemove(index, 'image/*', file?.image_id)}
//                                     className='absolute bg-white rounded-full -top-2 z-50 -right-2 text-2xl'
//                                 >
//                                     <IoCloseCircle />
//                                 </span>
//                             ) : null}
//                             <Image
//                                 src={file.url}
//                                 alt={`Upload ${index + 1}`}
//                                 className='w-full absolute top-0 rounded-lg left-0 h-full object-cover transition-opacity duration-300 opacity-0'
//                                 width={400}
//                                 height={400}
//                                 onLoadingComplete={image => {
//                                     image.classList.remove('opacity-0');
//                                 }}
//                             />
//                         </div>
//                         {!isCommunity && (
//                             <>
//                                 <Button
//                                     size='small'
//                                     title='Remove'
//                                     variant='solid'
//                                     className='transition-background max-w-full mx-2 group-hover:flex hidden rounded-full !focus:bg-gray !hover:bg-gray bg-gray  z-50 p-0 !text-xs'
//                                     onClick={() => handleRemove(index, props.fileType)}
//                                 />
//                                 <div className='absolute bg-opacity-40 bg-black inset-0 text-white opacity-0 group-hover:opacity-40  rounded-lg transition-all duration-300 flex items-center justify-center'></div>
//                             </>
//                         )}
//                     </div>
//                 ))}
//             {maxFiles === 1 && !props.isLoading && value?.image_url && (
//                 <div
//                     className={cn(
//                         'flex flex-col items-center justify-center group rounded-lg border',
//                         props.variant === 'cover-image'
//                             ? 'h-[250px] active:!scale-100 w-full'
//                             : 'h-24 w-24'
//                     )}
//                 >
//                     <div className='relative w-full h-full'>
//                         <div className='absolute top-1 right-1 z-50 px-2 py-1 rounded flex gap-1 bg-white'>
//                             <MdChangeCircle
//                                 size={25}
//                                 className='cursor-pointer'
//                                 onClick={handleClick}
//                             />
//                             <MdDelete
//                                 size={25}
//                                 className='cursor-pointer !text-red-600'
//                                 onClick={() => handleRemove(0, 'image/*', value?.image_id)}
//                             />
//                         </div>
//                         <Image
//                             src={value?.image_url}
//                             alt='Image Broken'
//                             className='w-full absolute top-0 rounded-lg left-0 h-full object-cover transition-opacity duration-300 opacity-0'
//                             width={400}
//                             height={400}
//                             onLoadingComplete={image => {
//                                 image.classList.remove('opacity-0');
//                             }}
//                         />
//                     </div>
//                 </div>
//             )}

//             {(value?.length < maxFiles || props.isLoading) && (
//                 <Button
//                     onClick={props.isLoading ? undefined : handleClick}
//                     disabled={disabled}
//                     className={cn(
//                         'w-24 h-24 border-2 group border-stroke !bg-transparent rounded-lg flex items-center justify-center text-gray hover:border-primary hover:text-primary transition-colors',
//                         props.variant === 'cover-image' ? '!h-[250px] active:!scale-100 w-full' : ''
//                     )}
//                 >
//                     {props.isLoading ? (
//                         <>Loading...</>
//                     ) : (
//                         <BiPlus className='text-2xl text-black bg-stroke rounded-full' />
//                     )}
//                 </Button>
//             )}
//         </div>
//     );
// };

// export default ImageUpload;
