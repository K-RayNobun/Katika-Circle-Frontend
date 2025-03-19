'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ProfileSection from '@/components/pagesComponents/SettingsProfile';
import HelpFAQSection from '@/components/pagesComponents/SettingsHelpFAQ';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'help'>('profile');

    const SidebarButton = ({tabName, title}:{tabName:string, title:string}) => {
        return (
            <button
                onClick={() => {if(tabName === 'profile' || tabName === 'help') {setActiveTab(tabName)}}}
                className={`grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] ${
                    activeTab === tabName ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 hover:text-primary hover:font-bold'
                }`}
            >
                <h5>{title}</h5>
            </button>
        )
    }

    return (
        <div className='relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl'>
            <main className='flex flex-col grow mb-[84px] lg:mb-0 lg:space-y-[16px]'>
                {/* Settings Header */}
                <div className='flex justify-between px-[6px] max-h-[100px]'>
                    <h5 className='text-[24px] my-[20px] lg:mt-[40px] font-bold'>Parametres</h5>
                    <div className='hidden lg:flex justify-between pl-[32px] gap-[32px] h-[59px]'>
                        <div className='size-[59px] flex justify-center items-center'>
                            <FontAwesomeIcon className='h-[32px] text-gray_dark' icon={faBell} />
                        </div>
                        <div className='h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white'>
                            <div className='size-[41px] rounded-sm bg-gray'>
                                {/* Profile Image here */}
                            </div>
                            <div className='flex justify-between items-center w-[108px]'>
                                <h5 className='text-[16px] text-gray_dark/60'>John Doe</h5>
                                <FontAwesomeIcon className='h-[16px] text-gray_dark/60' icon={faChevronDown} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <section className='flex flex-col lg:flex-row grow bg-white rounded-[12px]'>
                    {/* Settings Sidebar */}
                    <div className='h-full border-r-2 border-r-gray px-[12px] py-[8px]'>
                        <div className='flex lg:flex-col text-center lg:justify-start w-full lg:w-[160px] h-[64px] lg:h-max space-x-[6px] lg:space-y-[24px]'>
                            <SidebarButton tabName={`profile`} title='Profil' />
                            <SidebarButton tabName={`notifications`} title='Notifications' />
                            <SidebarButton tabName={`help`} title='Aide et FAQ' />
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <div className='w-full h-full'>
                        {activeTab === 'profile' && <ProfileSection />}
                        {activeTab === 'help' && <HelpFAQSection />}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsPage;