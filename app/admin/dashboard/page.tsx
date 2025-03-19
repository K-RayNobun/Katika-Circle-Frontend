'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import TransactionListAdmin from '@/components/TransactionListAdmin';

// Redux related import
import { useAppSelector } from '@/lib/redux/hooks';

interface transactionDetails {
    status: string, // Differentt status types: complete, pending, failed
    date: string,
    destinatoryName: string,
    amountSent: number,
    currencySent: string,
    cashbackGain: number,
  }

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('transactions');
    const accessToken = useAppSelector((state) => state.token.token);
    const fields = [
    {name: 'Date et Heure', property: 'date'},
    {name: 'Destinataire', property: 'destinatoryName'},
    {name: 'Montant envoyé', property: 'amountSent'},
    {name: 'Statut de la transaction', property: 'status'},
    {name: 'Cashback généré', property: 'cashbackGain'}
    ];
    const [selectedField, setSelectedField] = useState<keyof transactionDetails>('date');
    const [searchKey, setSearchKey] = useState('')


    return (
        <div className='h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl'>
            <main className='grow flex flex-col mb-[84px] lg:space-y-[16px]'>
                {/* Header */}
                <div className='flex justify-between px-[6px]'>
                    <h5 className='text-[24px] my-[20px] lg:mt-[40px] font-bold'>Admin Dashboard</h5>
                </div>

                {/* Tabs */}
                <div className='flex flex-col lg:flex-row flex-1 bg-white rounded-[12px]'>
                    {/* Sidebar Tabs */}
                    <div className='h-full border-r-2 border-r-gray px-[12px] py-[8px]'>
                        <div className='flex lg:flex-col text-center lg:justify-start w-full lg:w-[160px] h-[64px] lg:h-max space-x-[6px] lg:space-y-[24px]'>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] ${
                                    activeTab === 'users' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 hover:text-primary hover:font-bold'
                                }`}
                            >
                                <h5>Users</h5>
                            </button>
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] ${
                                    activeTab === 'transactions' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 hover:text-primary hover:font-bold'
                                }`}
                            >
                                <h5>Transactions</h5>
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <div className='w-full'>
                        {activeTab === 'transactions' && (
                            <div className='p-6'>
                                <div className='flex flex-col lg:flex-row justify-between gap-4 mb-6'>
                                    {/* Search Bar - Enhanced */}
                                    <div className='h-[44px] w-full lg:w-[40%] bg-white rounded-[12px] px-4 border-2 border-stroke hover:border-primary/30 focus-within:border-primary/50 transition-colors duration-200 flex items-center space-x-3 shadow-sm'>
                                        <FontAwesomeIcon 
                                            icon={faSearch} 
                                            className='size-[18px] text-gray_dark/70' 
                                        />
                                        <input 
                                            placeholder='Search transactions...' 
                                            onChange={(e) => setSearchKey(e.target.value)} 
                                            className='text-[15px] grow text-gray_dark placeholder:text-gray_dark/50 focus:outline-none'
                                        />
                                    </div>
                        
                                    {/* Filter Select - Enhanced */}
                                    <div className='relative h-[44px] w-full lg:w-[280px] group'>
                                        <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
                                            <FontAwesomeIcon 
                                                icon={faFilter} 
                                                className='size-[18px] text-gray_dark/70 group-hover:text-primary/70 transition-colors duration-200'
                                            />
                                        </div>
                                        <select 
                                            onChange={(e) => setSelectedField(e.target.value as keyof transactionDetails)} 
                                            className='h-full w-full pl-12 pr-4 appearance-none bg-white border-2 border-stroke 
                                                    rounded-[12px] text-[15px] text-gray_dark cursor-pointer
                                                    hover:border-primary/30 focus:border-primary/50 focus:outline-none
                                                    transition-colors duration-200 shadow-sm'
                                        >
                                            {fields.map((field, index) => (
                                                <option 
                                                    key={index} 
                                                    value={field.property}
                                                    className='py-2'
                                                >
                                                    {field.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                                            <FontAwesomeIcon 
                                                icon={faChevronDown} 
                                                className='size-[14px] text-gray_dark/70 group-hover:text-primary/70 transition-colors duration-200'
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <TransactionListAdmin
                                    accessToken={accessToken!}
                                    searchKey={searchKey}
                                    field={selectedField}
                                    onTransactionClick={(transaction) => console.log(transaction)}
                                />
                            </div>
                            
                        )}
                        {activeTab === 'users' && (
                            <div className='p-[24px]'>
                                <h4 className='text-[24px] font-bold text-primary'>Users</h4>
                                <p className='text-gray_dark'>Users tab is under construction.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;