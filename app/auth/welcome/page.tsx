'use client'

import React, { useRef } from 'react';

// Redux related imports
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import AsyncSpinner from '@/components/AsyncSpinner';

/*
    1. When an input is getting filled, convert its value into array
    2. pass that array to the official pinCode array where cases takes their values
*/

const Welcome = () => {

    const userData = useAppSelector((state) => state.user);
    const router = useRouter();
    const isSubmittingRef = useRef(false)
    const buttonStyle = `bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`;

    const handleOnclick = () => {
        isSubmittingRef.current = true;
        router.push('/user/home');
    }

  return (
        <div className=' w-[100%] grow h-[762px] flex flex-1 h-[100%] rounded-lg sm:rounded-3xl mx-auto p-3'>
            <div className='px-[5%] lg:px-[15px] w-full pt-[32px] '>
                <div className='relative pt-3'>
                    <div className=' absolute top-0 left-0 w-full h-2 rounded-full'></div>
                    <div className=' absolute top-0 left-0 w-[100%] h-2 bg-primary rounded-full'></div>
                    <div className='text-end h-[20px] text-primary_text text-[14px] mb-4'>
                        100%
                    </div>
                </div>
                <div className='flex h-[90%] flex-1 flex-col justify-center space-y-[30px]'>
                    <div className='px-[20px] space-y-[24px]'>
                        <div className='flex flex-col items-center text-center space-y-[10px]'>
                            <h3 className='font-bold text-[28px] text-purple-900 leading-12'>Welcome {userData.surname} {userData.name}</h3>
                            <h5 className='text-[17px]'>We&apos;re excited to have you onboard. Let&apos;s get you started!</h5>
                        </div>
                    </div>
                    <button onClick={handleOnclick} className={buttonStyle}>
                    {isSubmittingRef.current ? (
                        <>
                            <AsyncSpinner />
                            {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                        </>
                    ) : (
                        <h6 className='text-center font-bold'>Commencer</h6>
                    )}
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Welcome
