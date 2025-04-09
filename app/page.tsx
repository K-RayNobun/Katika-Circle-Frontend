'use client'

import React, {useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';


const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('Triggering r');
    router.push('/user/home');
  }, []);

return (
    <div className='bg-primary/15 h-screen w-screen flex items-center justify-center'>
      <Spinner />
    </div>
  )
}

export default HomePage;