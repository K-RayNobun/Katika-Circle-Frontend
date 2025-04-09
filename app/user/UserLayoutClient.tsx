'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { RiExchangeLine, RiHome9Line, RiTrophyLine } from "react-icons/ri";
import { PiGearSix } from "react-icons/pi";

// Redxu related import
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { resetUser } from '@/lib/redux/features/user/userSlice';
import { resetToken } from '@/lib/redux/features/token/tokenSlice';
import { resetTransaction } from '@/lib/redux/features/transaction/transactionSlice';
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
    const pathName = usePathname();

    const dispatch = useAppDispatch();
    

    const switchTab = (newTab: number) => {
        if (newTab >= 1 && newTab <= pagesRoutes.length && newTab !== actualTab) {
            const newPath = pagesRoutes[newTab - 1];
            setActualTab(newTab);
            router.push(newPath);
        }
    };

    const logoutUser = () => {
        dispatch(resetUser());
        dispatch(resetToken());
        dispatch(resetTransaction());
        router.push('/auth/signin');
    };

    useEffect(() => {
        if (!userData.verified || userData.email.length === 0) {
            // If the user is not verified or has logout, redirect to the sign-in page
            router.push('/auth/signin')
        } else {
            console.log(`---> Is user ${userData.email} verified ? ${userData.verified}`);
        }
    }, [userData.verified]);

    // Improved URL-Tab synchronization
    useEffect(() => {
        const index = pagesRoutes.findIndex(route => pathName.startsWith(route));
        if (index !== -1) {
            const newTab = index + 1;
            if (actualTab !== newTab) {
                setActualTab(newTab);
            }
        }
        // } else {
        //     // Handle invalid paths
        //     router.push('/user/home');
        // }
    }, [pathName]);

    return (
        <section className={`relative w-full bg-gray min-h-screen lg:h-[1024px] lg:px-[12px] px-[4px] pt-[12px] pb-[84px] lg:pb-[12px] flex justify-center flex-col lg:flex-row gap-[16px] rounded-lg sm:rounded-3xl mx-auto`}>
             { userData.verified && <aside className={`hidden lg:flex w-[22%] flex-col justify-between bg-primary rounded-3xl p-[32px]`}>
                <div className={`flex flex-col justify-between h-[456px]`}>
                    <Image src={'/logo_white.svg'} height={60} width={200} alt='' ></Image>
                    <div className={`h-[60%] flex flex-col justify-between`}>
                        <div onClick={() => switchTab(1)}  className={actualTab == 1 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiHome9Line size={actualTab == 1 ? 48: 24} className={`icon`} />
                            <h4>Acceuil</h4>
                        </div>
                        <div onClick={() => switchTab(2)} className={actualTab == 2 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiExchangeLine size={actualTab == 2 ? 48: 24} className={`icon`} />
                            <h4>Mes Transactions</h4>
                        </div>
                        <div onClick={() => switchTab(3)} className={actualTab == 3 ?`pannel_tab_active`: `pannel_tab`}>
                            <RiTrophyLine size={actualTab == 3 ? 48: 24} className={`icon`} />
                            <h4>Mes Recompenses</h4>
                        </div>
                        <div onClick={() => switchTab(4)} className={actualTab == 4 ?`pannel_tab_active`: `pannel_tab`}>
                            <PiGearSix size={actualTab == 4 ? 48: 24} className={`icon`} />
                            <h4>Parametres</h4>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col justify-between min-h-[200px]`}>
                    <div className={`flex flex-col justify-between gap-[12px]`}>
                        <Link href={`https://katika.io/userlicenseagreement`} target="_blank" rel='noopener noreferrer' className={`text-white font-light block`}>Mentions légales</Link>
                        <Link href={`https://katika.io/privacypolicy`} target="_blank" rel='noopener noreferrer' className={`text-white font-light block`}>Politique de confidentialité</Link>
                    </div>
                    <h5 className={`text-white/60 font-light`}>Version 1.1</h5>
                    <div className={`hover:bg-primary_dark rounded-[12px] px-[16px] py-[8px]`}>
                        <button onClick={logoutUser} className={`text-white transaition-all duration-300 hover:translate-x-[12px] active:scale-110`}>Logout</button>
                    </div>
                </div>
            </aside>
            }

            {/* //  Mobile View Data */}
            { userData.verified && <section className='fixed z-40 bottom-[12px] left-[50%] translate-x-[-50%] h-[64px] py-[5px] px-[5%] lg:hidden w-[95%] flex justify-between bg-primary rounded-[12px] '>
                {/* <Image src="/logo_white.bmp" width={180} height={20} alt="Logo not loaded" /> */}
                    <button onClick={() => switchTab(1)} className={actualTab == 1 ?`pannel_button_active`: `pannel_button`}>
                        <RiHome9Line size={actualTab == 1 ? 48 : 24} className={`icon`} />
                        <h4 className='text-[8px]'>Acceuil</h4>
                    </button>
                    <button onClick={() => switchTab(2)} className={actualTab == 2 ?`pannel_button_active`: `pannel_button`}>
                        <RiExchangeLine size={actualTab == 2 ? 48: 24} className={`icon`} />
                        <h4 className='text-[8px]'>Transactions</h4>
                    </button>
                    <button onClick={() => switchTab(3)} className={actualTab == 3 ?`pannel_button_active`: `pannel_button`}>
                        <RiTrophyLine size={24} className={`icon`} />
                        <h4 className='text-[8px]'>Recompenses</h4>
                    </button>
                    <button onClick={() => switchTab(4)} className={actualTab == 4 ?`pannel_button_active`: `pannel_button`}>
                        <PiGearSix size={actualTab == 4 ? 48: 24} className={`icon`} />
                        <h4 className='text-[8px]'>Parametres</h4>
                    </button>
            </section>}
                { userData.verified && children }
            </section>
    );
  }