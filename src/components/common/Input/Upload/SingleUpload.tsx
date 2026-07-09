// import Image from "next/image";
// import { BiPlus } from "react-icons/bi";

// const SingleImageUpload = ({ ...props }: BaseUploaderProps) => {
//     const { value, handleRemove, handleClick } = props;
//     return (
//         <div className="w-full h-full bg-background-input p-2 rounded-xl border border-stroke flex items-center justify-between">
//             <div className="relative w-24 h-24 group">
//                 {value?.length && value[0]?.url ? (
//                     <Image
//                         src={value[0]?.url}
//                         alt="Profile"
//                         className="w-full h-full rounded-full object-cover"
//                         width={96}
//                         height={96}
//                     />
//                 ) : (
//                     <div
//                         onClick={handleClick}
//                         className="w-full h-full rounded-full bg-stroke flex items-center justify-center"
//                     >
//                         <BiPlus className="text-2xl text-black bg-stroke rounded-full" />
//                     </div>
//                 )}
//             </div>

//             {value?.length > 0 && (
//                 <div className="flex items-center gap-2">
//                     <Button
//                         size="small"
//                         title="Change"
//                         btnVariant="secondary"
//                         customClassName="!text-xs !text-black !border-black !bg-white"
//                         onClick={handleClick}
//                     />
//                     <Button
//                         size="small"
//                         title="Remove"
//                         btnVariant="secondary"
//                         customClassName="!text-xs !bg-white !border !border-error !text-red-500"
//                         onClick={() => handleRemove(0, props.fileType)}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SingleImageUpload;
