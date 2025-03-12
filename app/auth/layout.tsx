'use client'

import React, { useState } from 'react';
import Image from 'next/image';

export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return (
        <section className={`bg-primary/15 min-h-screen lg:py-[100px] flex items-center`}>
            <div className=' sm:w-[80%] lg:w-[75%] h-[762px] flex h-[100%] rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
                <div className='hidden lg:block w-[35%] h-full bg-primary rounded-3xl p-6'>
                    <Image src={'/logo_white.png'} height={60} width={200} alt='' ></Image>
                </div>
                {children}
            </div>
        </section>
    )
  }