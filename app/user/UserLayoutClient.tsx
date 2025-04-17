'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { RiExchangeLine, RiHome9Line, RiTrophyLine } from "react-icons/ri";
import { PiGearSix } from "react-icons/pi";

// Redux related imports
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { resetUser } from '@/lib/redux/features/user/userSlice';
import { resetToken } from '@/lib/redux/features/token/tokenSlice';
import { resetTransaction } from '@/lib/redux/features/transaction/transactionSlice';

import Link from 'next/link';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [actualTab, setActualTab] = useState<number>(1);
    const [isSwitching, setIsSwitching] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pagesRoutes = ['/user/home', '/user/transactions', '/user/awards', '/user/settings'];
    const router = useRouter();
    const pathName = usePathname();
    const { t } = useTranslation();
    const userData = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const switchTab = (newTab: number) => {
        setIsSwitching(true);
        if ( isSwitching || newTab < 1 || newTab > pagesRoutes.length || newTab === actualTab) return;
        const newPath = pagesRoutes[newTab - 1];
        setActualTab(newTab);
        router.push(newPath);
        setIsSwitching(false);
    };

    const logoutUser = () => {
        setIsLoggingOut(true);
        dispatch(resetUser());
        dispatch(resetToken());
        dispatch(resetTransaction());
        // console.log('-------- USER LOGOUT --------');
        router.push('/auth/signin');
    };

    useEffect(() => {
        if (!userData.verified || userData.email.length === 0) {
            // If the user is not verified or has logged out, redirect to the sign-in page
            if (userData.verified) {
                // console.log(` ---------- USER EMAIL IS EMPTY ----------`)
            } else {
                // console.log('------------ HE IS NOt verified ------------')
            }
            router.push('/auth/signin');
        } else {
            // console.log(`---> Is user ${userData.email} verified? ${userData.verified}`);
        }
    }, [userData.verified, userData.email]);

    // Improved URL-Tab synchronization
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth'})
        const index = pagesRoutes.findIndex(route => pathName.startsWith(route));
        if (index !== -1) {
            const newTab = index + 1;
            if (actualTab !== newTab) {
                setActualTab(newTab);
            }
        }
    }, [pathName]);

    return (
        <section className={`relative w-full bg-gray min-h-screen lg:h-[1024px] lg:px-[12px] px-[4px] pt-[12px] pb-[84px] lg:pb-[12px] flex justify-center flex-col lg:flex-row gap-[16px] rounded-lg sm:rounded-3xl mx-auto`}>
            {userData.verified && (
                <aside className={`hidden lg:flex w-[22%] flex-col justify-between bg-primary rounded-3xl p-[32px]`}>
                    <div className={`flex flex-col justify-between h-[456px]`}>
                        <Image src={'/logo_white.svg'} height={60} width={200} alt='' />
                        <div className={`h-[60%] flex flex-col justify-between`}>
                            <div onClick={() => switchTab(1)} className={actualTab == 1 ? `pannel_tab_active` : `pannel_tab`}>
                                <RiHome9Line size={actualTab == 1 ? 48 : 24} className={`icon`} />
                                <h4>{t('userLayout.tabs.home')}</h4>
                            </div>
                            <div onClick={() => switchTab(2)} className={actualTab == 2 ? `pannel_tab_active` : `pannel_tab`}>
                                <RiExchangeLine size={actualTab == 2 ? 48 : 24} className={`icon`} />
                                <h4>{t('userLayout.tabs.transactions')}</h4>
                            </div>
                            <div onClick={() => switchTab(3)} className={actualTab == 3 ? `pannel_tab_active` : `pannel_tab`}>
                                <RiTrophyLine size={actualTab == 3 ? 48 : 24} className={`icon`} />
                                <h4>{t('userLayout.tabs.awards')}</h4>
                            </div>
                            <div onClick={() => switchTab(4)} className={actualTab == 4 ? `pannel_tab_active` : `pannel_tab`}>
                                <PiGearSix size={actualTab == 4 ? 48 : 24} className={`icon`} />
                                <h4>{t('userLayout.tabs.settings')}</h4>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col justify-between min-h-[200px]`}>
                        <div className={`flex flex-col justify-between gap-[12px]`}>
                            <Link href={`https://katika.io/userlicenseagreement`} target="_blank" rel='noopener noreferrer' className={`text-white font-light block`}>
                                {t('userLayout.footer.legalMentions')}
                            </Link>
                            <Link href={`https://katika.io/privacypolicy`} target="_blank" rel='noopener noreferrer' className={`text-white font-light block`}>
                                {t('userLayout.footer.privacyPolicy')}
                            </Link>
                        </div>
                        <h5 className={`text-white/60 font-light`}>{t('userLayout.footer.version')}</h5>
                        <div className={`hover:bg-primary_dark rounded-[12px] px-[16px] py-[8px]`}>
                            <button onClick={logoutUser} disabled={isLoggingOut}
                                    className={`text-white transition-all duration-300 hover:translate-x-[12px] active:scale-110`}>
                                {t('userLayout.footer.logout')}
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* Mobile View */}
            {userData.verified && (
                <section className='fixed z-40 bottom-[12px] left-[50%] translate-x-[-50%] h-[64px] py-[5px] px-[5%] lg:hidden w-[95%] flex justify-between bg-primary rounded-[12px]'>
                    <button onClick={() => switchTab(1)} className={actualTab == 1 ? `pannel_button_active` : `pannel_button`}>
                        <RiHome9Line size={actualTab == 1 ? 48 : 24} className={`icon`} />
                        <h4 className='text-[8px]'>{t('userLayout.mobileTabs.home')}</h4>
                    </button>
                    <button onClick={() => switchTab(2)} className={actualTab == 2 ? `pannel_button_active` : `pannel_button`}>
                        <RiExchangeLine size={actualTab == 2 ? 48 : 24} className={`icon`} />
                        <h4 className='text-[8px]'>{t('userLayout.mobileTabs.transactions')}</h4>
                    </button>
                    <button onClick={() => switchTab(3)} className={actualTab == 3 ? `pannel_button_active` : `pannel_button`}>
                        <RiTrophyLine size={24} className={`icon`} />
                        <h4 className='text-[8px]'>{t('userLayout.mobileTabs.awards')}</h4>
                    </button>
                    <button onClick={() => switchTab(4)} className={actualTab == 4 ? `pannel_button_active` : `pannel_button`}>
                        <PiGearSix size={actualTab == 4 ? 48 : 24} className={`icon`} />
                        <h4 className='text-[8px]'>{t('userLayout.mobileTabs.settings')}</h4>
                    </button>
                </section>
            )}
            {userData.verified && children}
        </section>
    );
}