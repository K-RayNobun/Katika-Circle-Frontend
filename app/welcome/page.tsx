'use client'

import React, { useState } from 'react';

/*
    1. When an input is getting filled, convert its value into array
    2. pass that array to the official pinCode array where cases takes their values
*/

const user = {
    name: 'Flick',
    surname: 'Edouard',
    email: 'flicked2002@gmail.com'
}
 
const Welcome = () => {

    const buttonStyle = `bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`;

  return (
    <div className='bg-primary/15 min-h-screen  py-[100px] flex items-center'>
        <div className=' sm:w-[80%] lg:w-[75%] h-[762px] flex h-[100%] rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
            <div className='hidden lg:block w-[35%] h-full bg-primary rounded-3xl p-6'>
                {/* <Image src="/logo_white.bmp" width={180} height={20} alt="Logo not loaded" /> */}
                <h3 className='text-white font-bold text-[30px]'>Katika Wallet</h3>
            </div>
            <div className='px-[10%] lg:px-[50px] pt-[32px] '>
                <div className='relative pt-3'>
                    <div className=' absolute top-0 left-0 w-full h-2 bg-gray rounded-full'></div>
                    <div className=' absolute top-0 left-0 w-[100%] h-2 bg-primary rounded-full'></div>
                    <div className='text-end h-[20px] text-primary_text text-[14px] mb-4'>
                        100%
                    </div>
                </div>
                <div className='flex h-[90%] flex-1 flex-col justify-center space-y-[30px]'>
                    <div className='px-[20px] space-y-[24px]'>
                        <div className='flex flex-col items-center text-center space-y-[10px]'>
                            <h3 className='font-bold text-[28px] text-purple-900 leading-12'>Welcome {user.name} {user.surname} </h3>
                            <h5 className='text-[17px]'>We're excited to have you onboard. Let's get you started!</h5>
                        </div>
                    </div>
                    <button className={buttonStyle}>Get Started</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Welcome
