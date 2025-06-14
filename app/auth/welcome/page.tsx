'use client'

import React, { useRef, useState } from 'react';

// Redux related imports
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import AsyncSpinner from '@/components/AsyncSpinner';
import { useTranslation } from '@/lib/hooks/useTranslation';

/*
    1. When an input is getting filled, convert its value into array
    2. pass that array to the official pinCode array where cases takes their values
*/

const Welcome = () => {

    const { t } = useTranslation();
    const userData = useAppSelector((state) => state.user);
    const router = useRouter();
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const buttonStyle = `bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`;

    const handleOnclick = () => {
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        router.push('/user/home');
    }

  return (
        <div className=' w-[100%] grow flex flex-1 h-[100%] rounded-lg sm:rounded-3xl mx-auto p-3'>
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
                            <h3 className='font-bold text-[28px] text-purple-900 leading-12'>{t('welcomePage.title')} {userData.surname} {userData.name}</h3>
                            <h5 className='text-[17px]'>{t('welcomePage.subtitle')}</h5>
                        </div>
                    </div>
                    <button onClick={handleOnclick} className={`${buttonStyle} ${isSubmitting ? "opacity-50" : 'opacity-100'}`}>
                    {isSubmitting ? (
                        <>
                            <AsyncSpinner />
                            {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                        </>
                    ) : (
                        <h6 className='text-center font-bold'>{t('welcomePage.button')}</h6>
                    )}
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Welcome
