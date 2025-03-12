'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExchangeAlt, faChevronDown, faBell } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import UserList from '@/components/NotificationList';
import TransactionList from '@/components/TransactionList';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleTabChange = (tab: 'users' | 'transactions') => {
        setActiveTab(tab);
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            <div className='grow flex flex-col space-y-[48px]'>
                <div className="flex flex-col space-y-[32px] px-[6px]">
                    <div className={`flex justify-between grow`}>
                        <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold '>Admin Dashboard</h5>
                        <div className='hidden lg:flex justify-between pl-[32px] gap-[32px] h-[59px]'>
                            <div className='size-[59px] flex justify-center items-center'>
                                <FontAwesomeIcon className='h-[32px] text-gray_dark' icon={faBell} />
                            </div>
                            <div className='h-full hidden lg:flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white'>
                                <div className='size-[41px] rounded-sm bg-gray'>
                                    {/* Profile Image here */}
                                </div>
                                <div className='flex justify-between items-center w-[108px]'>
                                    <h5 className='text-[16px] text-gray_dark/60'>Admin Name</h5>
                                    <FontAwesomeIcon className='h-[16px] text-gray_dark/60' icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between gap-[24px]'>
                        <button onClick={() => handleTabChange('users')} className={`h-[44px] w-full lg:w-[30%] bg-white rounded-[8px] px-[14px] py-[10px] border-2 border-stroke flex space-x-[8px] ${activeTab === 'users' ? 'bg-indigo text-white' : 'text-stroke'}`}>
                            <FontAwesomeIcon icon={faUsers} className='size-[20px]' />
                            <h5 className='text-[16px]'>Users</h5>
                        </button>
                        <button onClick={() => handleTabChange('transactions')} className={`h-[44px] w-full lg:w-[30%] bg-white rounded-[8px] px-[14px] py-[10px] border-2 border-stroke flex space-x-[8px] ${activeTab === 'transactions' ? 'bg-indigo text-white' : 'text-stroke'}`}>
                            <FontAwesomeIcon icon={faExchangeAlt} className='size-[20px]' />
                            <h5 className='text-[16px]'>Transactions</h5>
                        </button>
                    </div>
                </div>
                {activeTab === 'users' ? <UserList /> : <TransactionList />}
            </div>
            {isModalVisible && (
                <div className={`fixed top-0 left-0 right-0 z-20 flex bottom-0 items-center justify-center w-screen h-full bg-black/40`}>
                    <div className={`bg-white p-[24px] rounded-[12px]`}>
                        <h5 className='text-[24px] font-bold'>Modal Content</h5>
                        <button onClick={closeModal} className='mt-[16px] bg-indigo text-white px-[18px] py-[8px] rounded-[8px]'>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;