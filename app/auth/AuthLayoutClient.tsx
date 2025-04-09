'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Redux related import
import { usePathname } from 'next/navigation';

interface RouteMapping {
  endUrl: string;
  imageUrl: string;
  style: string;
}

const mapping: RouteMapping[] = [
  {endUrl: '/auth/signup/', imageUrl: '/auth/firstep_signup.svg', style: 'w-[100%] bottom-0'},
  {endUrl: '/auth/signin/', imageUrl: '/auth/firstep_signin.svg', style: 'w-[100%] bottom-0'},
  {endUrl: '/auth/pincheck/', imageUrl: '/auth/secondstep.svg', style: 'w-[80%]'},
  {endUrl: '/auth/welcome/', imageUrl: '/auth/welcomestep.svg', style: 'w-[100%] bottom-0'},
  {endUrl: '/auth/password_reset/', imageUrl: '/auth/resetpwd.svg', style: 'w-[80%]'},
  {endUrl: '/auth/mail_check/', imageUrl: '/auth/resetpwd.svg', style: 'w-[80%]'},
];

export default function AuthLayoutClient({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [addedStyle, setAddedStyle] = useState('w-[100%] bottom-0');
    // const [isImageLoaded, setIsImageLoaded] = useState(false);

    const pathName = usePathname();
    
    useEffect(() => {
      const match = mapping.find(map => pathName.endsWith(map.endUrl));
      if (match) {
        if (imageUrl !== match.imageUrl) setImageUrl(match.imageUrl);
        if (addedStyle !== match.style) setAddedStyle(match.style);
      } else {
        setImageUrl(null);
        setAddedStyle('w-[100%] bottom-0');
      }
    }, [pathName]);

    return (
        <section className={`bg-primary/15 min-h-screen lg:py-[100px] flex items-center`}>
            <div className=' sm:w-[80%] lg:w-[75%] h-[762px] flex rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
                <div className='hidden lg:flex items-center justify-center relative w-[35%] h-full bg-gray rounded-3xl'>
                    <Image src={'/logo_color.svg'} className='absolute top-[24px] left-[24px]' height={60} width={200} alt='' ></Image>
                    {imageUrl ? 
                      <Image src={imageUrl} height={424} width={80} alt='' className={`absolute ${addedStyle}`}></Image>
                      :
                      <div className="w-[120px] h-[120px] rounded-[50%] opacity-60 bg-primary/20 animate-pulse" />
                    }
                </div>
                { children }
            </div>
        </section>
    )
  }