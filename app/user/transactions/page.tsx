'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import TransactionList from '@/components/TransactionList';

//Redux related imports
import { useAppSelector } from '@/lib/redux/hooks';

interface transactionDetails {
    status: string, // Differentt status types: complete, pending, failed
    date: string,
    destinatoryName: string,
    amountSent: number,
    currencySent: string,
    cashbackGain: number,
  }
 
const TransactionBoard = () => {
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
                    <div className='flex justify-between gap-[12px] lg:gap-[24px]'>
                        <div className='h-[44px] w-[80%] lg:w-[30%] bg-white rounded-[8px] px-[14px] py-[10px] border-2 border-stroke flex space-x-[8px]'>
                            <FontAwesomeIcon icon={faSearch} className='size-[20px] text-stroke' />
                            <input placeholder='Search' onChange={(e) => setSearchKey(e.target.value)} className='text-[16px] w-[80%] text-gray_dark'/>
                        </div>
                        <div className='relative h-[44px] w-[40px] lg:w-[220px] bg-white border-2 border-stroke rounded-[8px] flex items-center gap-[9px]'>
                            <FontAwesomeIcon icon={faFilter} className='size-[20px] text-stroke mx-[8px]'/>
                            <select onChange={(e) => {setSelectedField(e.target.value as keyof transactionDetails); setSearchKey(searchKey)}} className='inline absolute top-0 left-0 lg:relative right-[8px] size-[100%] lg:w-[80%] bg-transparent text-transparent lg:text-stroke lg:hover:text-primary_dark text-[16px]'>
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