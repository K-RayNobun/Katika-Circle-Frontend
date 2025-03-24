'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiExchangeLine, RiHome9Line, RiTrophyLine } from "react-icons/ri";
import { PiGearSix } from "react-icons/pi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGears } from '@fortawesome/free-solid-svg-icons';

// Redxu related import
import { useAppSelector } from '@/lib/redux/hooks';
import Link from 'next/link';

export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [actualTab, setActualTab] = useState<number>(1);
    const pagesRoutes = ['/user/home', '/user/transactions', '/user/awards', '/user/settings']
    const userData = useAppSelector((state) => state.user);
    const router = useRouter();

    const fullUrl = window.location.href;
    
    if (userData.verified === false) {
        router.push('/auth/signin');
        console.log('====== THE USER IS NOT VERIFIED ========')
    } else {
        // console.log('\n\n ============================================= The user verified is :', userData.name + ' ' + userData.surname);
    }

    const switchTab = (newTab: number) => {
        if (actualTab !== newTab) {
            console.log('Previous tab was ', actualTab);
            setActualTab(newTab);   
            router.push(pagesRoutes[newTab-1]);
            console.log('Moving to tab', newTab + ' whose url is ' + pagesRoutes[newTab-1]);
        } else return;
    }

    useEffect(() => {
        pagesRoutes.forEach((endUrl, index) => {
            if (fullUrl.includes(endUrl) && actualTab !== index+1) {
                router.push(endUrl);
                setActualTab(index+1)
                console.log('###------ This Page Url Has Been Fixed ------###')
            }
        })
    }, [])

    return (
        <section className={`relative w-screen bg-gray min-h-screen lg:h-[1024px] px-[8px] lg:px-[12px] flex flex-col lg:flex-row gap-[16px] rounded-lg sm:rounded-3xl mx-auto p-3`}>
          <aside className={`hidden lg:flex w-[22%] flex-col justify-between bg-primary rounded-3xl p-[32px]`}>
                <div className={`flex flex-col justify-between h-[456px]`}>
                    <Image src={'/logo_white.png'} height={60} width={200} alt='' ></Image>
                    <div className={`h-[60%] flex flex-col justify-between`}>
                        <div onClick={() => switchTab(1)}  className={actualTab == 1 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiHome9Line className={`icon size-[24px]`} />
                            <h4>Acceuil</h4>
                        </div>
                        <div onClick={() => switchTab(2)} className={actualTab == 2 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiExchangeLine className={`icon size-[24px]`} />
                            <h4>Mes Transactions</h4>
                        </div>
                        <div onClick={() => switchTab(3)} className={actualTab == 3 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiTrophyLine className={`icon size-[24px]`} />
                            <h4>Mes Recompenses</h4>
                        </div>
                        <div onClick={() => switchTab(4)} className={actualTab == 4 ?`pannel_tab_active`: `pannel_tab`}>
                            <PiGearSix className={`icon size-[24px]`} />
                            <h4>Parametres</h4>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col justify-between min-h-[120px]`}>
                    <div className={`flex flex-col justify-between gap-[12px]`}>
                        <Link href={`https://katika.io/userlicenseagreement`} className={`text-white font-light block`}>Mentions légales</Link>
                        <Link href={`https://katika.io/privacypolicy`} className={`text-white font-light block`}>Politique de confidentialité</Link>
                    </div>
                    <h5 className={`text-white/60 font-light`}>Version 1.1</h5>
                </div>
            </aside>

            {/* Mobile View Bottombar */}
            <section className='fixed z-10 bottom-[12px] left-1/2 translate-x-[-50%]  h-[64px] py-[5px] px-[5%] lg:hidden w-[95%] flex justify-between bg-primary rounded-[12px] '>
                {/* <Image src="/logo_white.bmp" width={180} height={20} alt="Logo not loaded" /> */}
                    <button onClick={() => switchTab(1)} className={actualTab == 1 ?`pannel_button_active`: `pannel_button`}>
                        <FontAwesomeIcon className='h-[16px]' icon={faHome}/>
                        <h4 className='text-[12px]'>Acceuil</h4>
                    </button>
                    <button onClick={() => switchTab(2)} className={actualTab == 2 ?`pannel_button_active`: `pannel_button`}>
                        <FontAwesomeIcon className='h-[16px]' icon={faCoins}/>
                        <h4 className='text-[12px]'>Transactions</h4>
                    </button>
                    <button onClick={() => switchTab(3)} className={actualTab == 3 ?`pannel_button_active`: `pannel_button`}>
                        <FontAwesomeIcon className='h-[16px]' icon={faTrophy}/>
                        <h4 className='text-[12px]'>Recompenses</h4>
                    </button>
                    <button onClick={() => switchTab(4)} className={actualTab == 4 ?`pannel_button_active`: `pannel_button`}>
                        <FontAwesomeIcon className='h-[16px]' icon={faGears}/>
                        <h4 className='text-[12px]'>Parametres</h4>
                    </button>
            </section>
                { userData.verified && children }
            </section>
    );
  }