'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGears } from '@fortawesome/free-solid-svg-icons';

export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [actualTab, setActualTab] = useState<number>(1);
    const pagesRoutes = ['/user/home', '/user/transactions', '/user/awards', '/user/settings/profile']
    const router = useRouter();

    const switchTab = (newTab) => {
        if (actualTab !== newTab) {
            setActualTab(newTab);
            router.push(pagesRoutes[newTab-1]);
            console.log('Moving to tab', newTab);
        } else return;
    }

    return (
      <html lang="en">
        <body className={`relative w-screen bg-gray min-h-screen lg:h-[1024px] px-[8px] lg:px-[12px] flex flex-col lg:flex-row gap-[16px] rounded-lg sm:rounded-3xl mx-auto p-3`}>
          <aside className={`hidden lg:flex w-[22%] flex-col justify-between bg-primary rounded-3xl p-6`}>
                <div className={`flex flex-col justify-between h-[456px]`}>
                    <h3 className={`text-white font-bold text-[30px]`}>Katika Wallet</h3>
                    <div className={`h-[60%] flex flex-col justify-between`}>
                        <div onClick={() => switchTab(1)}  className={actualTab == 1 ?`pannel_tab_active`: `pannel_tab`}>
                            <FontAwesomeIcon className={`icon h-[20px]`} icon={faHome} />
                            <h4>Acceuil</h4>
                        </div>
                        <div onClick={() => switchTab(2)} className={actualTab == 2 ?`pannel_tab_active`: `pannel_tab`}>
                            <FontAwesomeIcon className={`icon h-[20px]`} icon={faCoins} />
                            <h4>Mes Transactions</h4>
                        </div>
                        <div onClick={() => switchTab(3)} className={actualTab == 3 ?`pannel_tab_active`: `pannel_tab`}>
                            <FontAwesomeIcon className={`icon h-[20px]`} icon={faTrophy} />
                            <h4>Mes Recompenses</h4>
                        </div>
                        <div onClick={() => switchTab(4)} className={actualTab == 4 ?`pannel_tab_active`: `pannel_tab`}>
                            <FontAwesomeIcon className={`icon h-[20px]`} icon={faGears} />
                            <h4>Parametres</h4>
                        </div>
                    </div>
                </div>
                <div className={``}>
                    <h5 className={`text-white font-light`}>Version 1.1</h5>
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
            {children}
        </body>
      </html>
    );
  }