'use client';

import React, { useState } from 'react';
import { PiUserCircle, PiBellRinging, PiQuestion, PiStudent } from "react-icons/pi";

import UserProfile from '@/components/pagesComponents/UserProfile';
import ProfileSection from '@/components/pagesComponents/SettingsProfile';
import HelpFAQSection from '@/components/pagesComponents/SettingsHelpFAQ';
import SettingsTutorials from './tutorials/signetTutorial/components/MainPage';

import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'help' | 'tutorials'>('profile');
    const userData = useAppSelector((state) => state.user)

    const tabList = ['profile', 'notifications', 'help', 'tutorials'] as const;

    const searchParams = useSearchParams();

    const sidebarData = [
        { name: 'profile', title: 'Profil', icon: <PiUserCircle size={26} /> },
        { name: 'notifications', title: 'Notifications', icon: <PiBellRinging size={26} /> },
        { name: 'help', title: 'Aide et FAQ', icon: <PiQuestion size={26} /> },
        { name: 'tutorials', title: 'Tutoriels', icon: <PiStudent size={26} /> }
    ];

    useEffect(() => {
        // Suppose url has the parameter
        const tab = searchParams.get('tab');
        if (tab && tabList.includes(tab as typeof tabList[number])) {
            setActiveTab(tab as typeof tabList[number]);
        }
    }, [searchParams]);

    const SidebarButton = ({tabName, title}:{tabName:string, title:string}) => {
        return (
            <>  
                <button
                    onClick={() => {if(tabName === 'profile' || tabName === 'help' || tabName === 'tutorials') {setActiveTab(tabName)}}}
                    className={`flex flex-col items-center justify-center lg:justify-start h-full px-[16px] py-[10px] rounded-[8px] ${
                        activeTab === tabName ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 hover:text-primary hover:font-bold'
                    }`}
                >
                    <span className="block lg:hidden font-bold">{sidebarData.find(item => item.name === tabName)?.icon}</span>
                    <h5 className="text-[10px] lg:text-[16px]">{title}</h5>
                </button>

            </>
        )
    }

    return (
        <div className='relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl'>
            <main className='flex flex-col grow lg:space-y-[16px]'>
                {/* Settings Header */}
                <div className='flex justify-between px-[6px] max-h-[100px]'>
                    <h5 className='text-[24px] my-[20px] lg:mt-[40px] font-bold'>Parametres</h5>
                    <UserProfile userName={userData.name}  userSurname={userData.surname} />
                </div>

                {/* Settings Content */}
                <section className='flex flex-col lg:flex-row grow bg-white rounded-[12px]'>
                    {/* Settings Sidebar */}
                    <div className='h-full border-r-2 border-r-gray px-[12px] py-[8px]'>
                        <div className='flex lg:flex-col text-center lg:justify-center w-full lg:w-[160px] h-[64px] lg:h-max space-x-[6px] lg:space-x-0 lg:space-y-[24px] overflow-x-auto'>
                            {sidebarData.map((item) => (
                                <SidebarButton key={item.name} tabName={item.name} title={item.title} />
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <div className='w-full h-full'>
                        {activeTab === 'profile' && <ProfileSection />}
                        {activeTab === 'help' && <HelpFAQSection />}
                        {activeTab === 'tutorials' && <SettingsTutorials />}
                        {/* Placeholder for Notifications section */}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsPage;