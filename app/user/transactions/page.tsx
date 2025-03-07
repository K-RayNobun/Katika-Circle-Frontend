'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGear, faChevronDown,  faSearch, faFilter, faArrowDown, faBan } from '@fortawesome/free-solid-svg-icons';
import { faBell, faPaperPlane, faClock } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import TransactionList from '@/components/TransactionList';
 
const TransactionBoard = () => {
  return (
        <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            <div className='grow flex flex-col space-y-[48px]'>
                <div className="flex flex-col space-y-[32px] px-[6px] ">
                    <div className={`flex justify-between grow`}>
                        <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold '>Mes Transactions</h5>
                        <div className='hidden lg:flex justify-between pl-[32px] gap-[32px] h-[59px]'>
                            <div className='size-[59px] flex justify-center items-center'>
                                <FontAwesomeIcon className='h-[32px] text-gray_dark' icon={faBell} />
                            </div>
                            <div className='h-full hidden lg:flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white'>
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
                    <div className='flex justify-between gap-[24px]'>
                        <div className='h-[44px] w-full lg:w-[30%] bg-white rounded-[8px] px-[14px] py-[10px] border-2 border-stroke flex space-x-[8px]'>
                            <FontAwesomeIcon icon={faSearch} className='size-[20px] text-stroke' />
                            <h5 className='text-[16px] text-stroke'>Search</h5>
                        </div>
                        <div className='h-[44px] w-max bg-white border-2 border-stroke rounded-[8px] px-[14px] py-[10px] flex gap-[9px] justify-between items-center'>
                            <FontAwesomeIcon icon={faFilter} className='size-[20px] text-stroke' />
                            <h5 className='hidden lg:inline text-[16px] text-stroke'>Filtre</h5>
                            <FontAwesomeIcon className='h-[16px] text-stroke' icon={faChevronDown} />
                        </div>
                    </div>
                </div>
                <TransactionList />
            </div>
    </div>
  )
}

export default TransactionBoard