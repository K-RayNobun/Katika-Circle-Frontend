'use client'

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';


const HomePage = () => {

  const router =  useRouter();
  const pathName = usePathname();

  useEffect(() => {
    // If the path is `/` moves to `/user/home`
    console.log('The pathName is: ', pathName);
    if (pathName === '/') {
      console.log('========= Moving to Home =========')
      router.push('/user/home');
    }
  }, [pathName])

  return (
    <div className='bg-blue-700/40 h-screen w-screen flex items-center justify-center'>
      <h1 className='text-[86px] font-semibold text-white'>App</h1>
    </div>
  )
}

export default HomePage;