import React, { useState } from 'react'
import { Modal } from 'antd';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ViewSampleModalProps {
  open: boolean;
  onClose: () => void;
}

export const ViewSampleModal = ({ open, onClose}: ViewSampleModalProps) => {
  const [mode] = useQueryState('mode');
  const router = useRouter();
  const [onLoad, setOnLoad] = useState(false);

  const data=[
    {
      mode:'title',
      title: "Header Title",
      image:"/images/settings/Title.png"
    },{
      mode:'caption',
      title: "Header Caption",
      image:"/images/settings/Captions.png"
    },{
      mode:'cta',
      title: "Header CTA Button",
      image:"/images/settings/Buttons.png"
    },{
      mode:'categories',
      title: "Categories on Home page",
      image:"/images/settings/Category.png"
    },
  ]
  const filteredData = data.filter((item)=>item.mode === mode);

  return (
    <Modal 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      width={772} 
      height={574}
      centered
    >
        <div>
          {filteredData.map((item)=>(
            <div key={item.mode}>
              <h3 className='text-xl font-bold'>{item.title}</h3>
                <img 
                  onLoad={()=>setOnLoad(true)} 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-full h-auto object-cover rounded-lg mt-6 ${onLoad ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}
                />
            </div>
          ))}
        </div>
    </Modal>
  )
}
