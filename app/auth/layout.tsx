'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Redux related import
import { usePathname } from 'next/navigation';

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [imageUrl, setImageUrl] = useState('');
    const [addedStyle, setAddedStyle] = useState('');

    const mapping = [
      {endUrl: '/auth/signup', imageUrl: '/auth/firstep_signup.svg', style: 'w-[100%] bottom-0'},
      {endUrl: '/auth/signin', imageUrl: '/auth/firstep_signin.svg', style: 'w-[100%] bottom-0'},
      {endUrl: '/auth/pincheck', imageUrl: '/auth/secondstep.svg', style: 'w-[80%]'},
      {endUrl: '/auth/welcome', imageUrl: '/auth/thirdstep.png', style: 'w-[180px]'},
    ]

    const pathName = usePathname();
    
    useEffect(() => {
      mapping.forEach((map) => {
        if (pathName.endsWith(map.endUrl)) {
          setImageUrl(map.imageUrl);
          setAddedStyle(map.style)
        }
      })
    }, [mapping, pathName])

    return (
        <section className={`bg-primary/15 min-h-screen lg:py-[100px] flex items-center`}>
            <div className=' sm:w-[80%] lg:w-[75%] h-[762px] flex h-[100%] rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
                <div className='hidden lg:flex items-center justify-center relative w-[35%] h-full bg-gray rounded-3xl'>
                    <Image src={'/logo_color.svg'} className='absolute top-[24px] left-[24px]' height={60} width={200} alt='' ></Image>
                    <Image src={imageUrl} height={424} width={80} alt='' className={`absolute ${addedStyle}`}></Image>
                </div>
                { children }
            </div>
        </section>
    )
  }