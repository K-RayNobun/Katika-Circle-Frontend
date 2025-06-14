'use client'

import { FiSearch, FiFilter } from "react-icons/fi";
import React, { useState } from 'react';
import TransactionList from '@/components/TransactionList';

import UserProfile from '@/components/pagesComponents/UserProfile';

//Redux related imports
import { useAppSelector } from '@/lib/redux/hooks';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface transactionDetails {
    status: string, // Different status types: complete, pending, failed
    date: string,
    destinatoryName: string,
    amountSent: number,
    currencySent: string,
    cashbackGain: number,
}

const TransactionBoard = () => {
    const accessToken = useAppSelector((state) => state.token.token);
    const userData = useAppSelector((state) => state.user);
    const { t } = useTranslation();

    const fields = [
        { name: t('transactionsPage.fields.date'), property: 'date' },
        { name: t('transactionsPage.fields.destinatoryName'), property: 'destinatoryName' },
        { name: t('transactionsPage.fields.amountSent'), property: 'amountSent' },
        { name: t('transactionsPage.fields.status'), property: 'status' },
        { name: t('transactionsPage.fields.cashbackGain'), property: 'cashbackGain' }
    ];
    const [selectedField, setSelectedField] = useState<keyof transactionDetails>('date');
    const [searchKey, setSearchKey] = useState('')

    return (
        <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            <UserProfile userName={userData.name} userSurname={userData.surname} />
            <div className='grow flex flex-col space-y-[48px]'>
                <div className="flex flex-col space-y-[72px] px-[6px] ">
                    <div className={`flex justify-between grow`}>
                        <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold '>{t('transactionsPage.title')}</h5>
                    </div>
                    <div className='flex justify-between gap-[12px] lg:gap-[24px]'>
                        <div className='h-[44px] w-[80%] lg:w-[30%] bg-white rounded-[8px] px-[14px] py-[10px] border-2 border-stroke flex space-x-[8px]'>
                            <FiSearch size={20} className='text-stroke font-semibold' />
                            <input placeholder={t('transactionsPage.searchPlaceholder')} onChange={(e) => setSearchKey(e.target.value)} className='text-[16px] w-[80%] text-gray_dark' />
                        </div>
                        <div className='relative h-[44px] w-[40px] lg:w-[220px] bg-white border-2 border-stroke rounded-[8px] flex items-center gap-[9px]'>
                            <FiFilter size={20} className='text-stroke font-semibold mx-[8px]' />
                            <select onChange={(e) => { setSelectedField(e.target.value as keyof transactionDetails); setSearchKey(searchKey) }} className='inline absolute top-0 left-0 lg:relative right-[8px] size-[100%] lg:w-[80%] bg-transparent text-transparent lg:text-stroke lg:hover:text-primary_dark text-[16px]'>
                                {
                                    fields.map((field, index) => (
                                        <option key={index} value={field.property} className='inline-block text-black'>
                                            {field.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <TransactionList accessToken={accessToken!} searchKey={searchKey} field={selectedField} />
            </div>
        </div>
    )
}

export default TransactionBoard