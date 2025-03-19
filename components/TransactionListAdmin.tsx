'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBan, faArrowDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface TransactionAdminDetails {
    id: number;
    order: number;
    status: string; // Different status types: complete, pending, failed
    date: string;
    destinatoryName: string;
    amountSent: number;
    currencySent: string;
    cashbackGain: number;
    transferType?: string;
    amountReceived?: number;
    currencyReceived?: string;
    receiverCountry?: string;
    receiverName?: string,
    receiverBankName?: string,
    receiverBankIban?: string,
    receiverPhone?: number
}

interface TransactionListProps {
    accessToken: string;
    searchKey: string;
    field: keyof TransactionAdminDetails;
    onTransactionClick: (transaction: TransactionAdminDetails) => void;
}

const handleStatus = (status: string) => {
    let style = {
        bgColor: '',
        textColor: '',
        icon: <FontAwesomeIcon icon={faPaperPlane} />,
    };
    return status.toLowerCase() === 'success'
        ? {
              bgColor: 'bg-[#EDFFEC]',
              textColor: 'text-[#009646]',
              icon: <FontAwesomeIcon className='size-[20px]' icon={faPaperPlane} />,
          }
        : status.toLowerCase() === 'pending'
        ? {
              bgColor: 'bg-[#FFE9DB]',
              textColor: 'text-[#FF5C00]',
              icon: <FontAwesomeIcon className='size-[24px]' icon={faClock} />,
          }
        : (status.toLowerCase() === 'failed' || status.toLowerCase() === 'cancelled')
        ? {
              bgColor: 'bg-red/20',
              textColor: 'text-[#FF0004]',
              icon: <FontAwesomeIcon className='size-[24px]' icon={faBan} />,
          }
        : style;
};

const Transaction = ({ details, onClick }: { details: TransactionAdminDetails; onClick: () => void }) => {
    const style = handleStatus(details.status);

    return (
        <div onClick={onClick} className='cursor-pointer'>
            <tr className='hidden lg:flex w-full h-[72px] items-center text-center bg-white border-[#EAECF0] border-b text-[14px] font-bold px-[24px]'>
                <td className='w-[22%] px-[12px]'>
                    <h5 className='text-[#AFB4C0]'>{details.date}</h5>
                </td>
                <td className='w-[30%] px-[12px]'>
                    <h5>{details.destinatoryName}</h5>
                </td>
                <td className='w-[14%] px-[12px]'>
                    <h5>{details.amountSent}</h5>
                </td>
                <td className='w-[20%] px-[12px] flex items-center justify-center'>
                    <h4
                        className={`font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px] ${style.textColor} ${style.bgColor}`}
                    >
                        {details.status}
                    </h4>
                </td>
                <td className='w-[14%] px-[12px]'>{details.cashbackGain || 0}</td>
            </tr>
            <tr className='flex flex-col items-start lg:hidden w-full bg-white border-[#EAECF0] border-b rounded-[8px] text-[14px] font-bold px-[24px] py-[7px]'>
                <td className='font-light'>
                    <h5 className='text-[#AFB4C0]'>{details.date}</h5>
                </td>
                <div className='flex items-center w-full'>
                    <div
                        className={`lg:hidden h-[40px] mt-[-30px] text-[16px] rounded-full flex items-center justify-center ${style.bgColor} ${style.textColor}`}
                    >
                        {style.icon}
                    </div>
                    <div>
                        <td className='w-[30%] px-[12px]'>
                            <h5 className='text-[12px]'>{details.destinatoryName}</h5>
                        </td>
                        <td className='w-[20%] px-[12px] flex items-center'>
                            <h4 className={`font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px] ${style.textColor}`}>
                                {details.status}
                            </h4>
                        </td>
                    </div>
                    <div className='grow'></div>
                    <td className='w-[14%] px-[12px]'>
                        <h5>{details.amountSent}</h5>
                    </td>
                </div>
            </tr>
        </div>
    );
};

const TransactionListAdmin = ({ accessToken, searchKey, field, onTransactionClick }: TransactionListProps) => {
    const [transactionsList, setTransactionsList] = useState<Array<TransactionAdminDetails>>([]);
    const [searchResultList, setSearchResultList] = useState<Array<TransactionAdminDetails>>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionAdminDetails | null>(null);

    const updateTransactionStatus = async({status, id}: {status: string, id:number}) => {
        const response = await axios.put(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transaction/${id}`,
            {
                "status": status
            },
            {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
            }
        );
        console.log('We set the status to:', status);
        console.log('The response is:', response);
    }

    const validateTransaction = () => {
        updateTransactionStatus({status: 'Success', id: selectedTransaction!.id});
        setSelectedTransaction(null);
    }
        
    useEffect(() => {
        const fetchTransactionList = async () => {
            try {
                const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transactions`, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });

                const fetchedList = response.data.data.slice().reverse();
                console.log('Got the transactions list as', fetchedList.slice(0, 9));
                const transactionArray: Array<TransactionAdminDetails> = fetchedList.map((transaction: any, index: number) => ({
                    id: transaction.id,
                    order: index,
                    status: transaction.transactionStatus,
                    date: new Date(transaction.creationDate).toLocaleString('en-US'),
                    amountSent: transaction.amount,
                    currencySent: transaction.currency.toLowerCase() === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase(),
                    destinatoryName: transaction.recipient.name,
                    cashbackGain: transaction.transactionStatus === 'Success' ? transaction.cashBack.amount : 0,
                    transferType: transaction.transactionType,
                    amountReceived: transaction.recipient.amountReceive,
                    currencyReceived: transaction.recipient.receiverCountry.toLowerCase() === 'cameroon' ? 'XAF' : '???',
                    receiverName: transaction.recipient.name,
                    receiverPhone: transaction.recipient.phone,
                    receiverBankName: transaction.recipient.bankName,
                    receiverBankIban: transaction.recipient.iban,
                    receiverCountry: transaction.recipient.receiverCountry,
                }));

                setTransactionsList(transactionArray);
            } catch (error) {
                console.error('Error while fetching transaction list:', error);
            }
        };

        fetchTransactionList();
    }, [accessToken]);

    useEffect(() => {
        if (searchKey.length > 0) {
            const transactionArray: Array<TransactionAdminDetails> = transactionsList.filter((transaction) =>
                transaction[field]!.toString().toLowerCase().includes(searchKey.toLowerCase())
            );
            setSearchResultList(transactionArray);
        }
    }, [searchKey, field, transactionsList]);

    return (
        <div className='grow w-full overflow-auto max-h-[772px] overflow-y-auto'>
            <table className='flex flex-col w-full mb-[50px]'>
                <thead>
                    <tr className='hidden lg:flex w-full bg-[#F9FAFB] text-gray_dark py-[12px] px-[24px] border border-[#EAECF0]'>
                        <th className='w-[22%] px-[12px]'>
                            Date et Heure <FontAwesomeIcon size='sm' icon={faArrowDown} className='ml-1' />
                        </th>
                        <th className='w-[30%] px-[12px]'>Destinataire</th>
                        <th className='w-[14%] px-[12px]'>Montant envoyé</th>
                        <th className='w-[20%] px-[12px]'>Statut de la transaction</th>
                        <th className='w-[14%] px-[12px]'>Cashback généré</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='block h-full w-full space-y-[16px] lg:space-y-[0px] overflow-auto'>
                        {searchKey.length === 0
                            ? transactionsList.map((transaction, i) => (
                                  <Transaction
                                      key={i}
                                      details={transaction}
                                      onClick={() => {
                                          setSelectedTransaction(transaction);
                                          onTransactionClick(transaction);
                                      }}
                                  />
                              ))
                            : searchResultList.map((transaction, i) => (
                                  <Transaction
                                      key={i}
                                      details={transaction}
                                      onClick={() => {
                                          setSelectedTransaction(transaction);
                                          onTransactionClick(transaction);
                                      }}
                                  />
                              ))}
                    </tr>
                </tbody>
            </table>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4'>
                    <div className={`bg-white rounded-[16px] w-[90%] lg:w-[50%] max-h-[85vh] overflow-auto transform transition-all duration-300 ease-out scale-in ${
                        handleStatus(selectedTransaction.status).bgColor.replace('bg-', 'border-')
                    } border-l-4 shadow-2xl`}>
                        {/* Header section */}
                        <div className='sticky top-0 bg-white px-6 py-4 border-b border-gray-100'>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-[24px] font-bold'>Transaction Details</h3>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${handleStatus(selectedTransaction.status).bgColor} ${handleStatus(selectedTransaction.status).textColor}`}>
                                    {handleStatus(selectedTransaction.status).icon}
                                    <span className='text-sm font-medium'>{selectedTransaction.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content section */}
                        <div className='p-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Date</h5>
                                        <p className='font-semibold'>{selectedTransaction.date}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Destinataire</h5>
                                        <p className='font-semibold'>{selectedTransaction.destinatoryName}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Montant envoyé</h5>
                                        <p className='font-semibold text-lg'>
                                            {selectedTransaction.amountSent} {selectedTransaction.currencySent}
                                        </p>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Montant reçu</h5>
                                        <p className='font-semibold text-lg'>
                                            {selectedTransaction.amountReceived} {selectedTransaction.currencyReceived}
                                        </p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Cashback généré</h5>
                                        <p className='font-semibold text-primary'>{selectedTransaction.cashbackGain} XAF</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Pays du destinataire</h5>
                                        <p className='font-semibold'>{selectedTransaction.receiverCountry}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional sections */}
                            {selectedTransaction.transferType === 'MobileMoney' && (
                                <div className='mt-6 bg-gray-50 p-4 rounded-lg space-y-4'>
                                    <h4 className='font-semibold text-primary'>Mobile Money Details</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Nom du destinataire</h5>
                                            <p className='font-semibold'>{selectedTransaction.destinatoryName}</p>
                                        </div>
                                        <div>
                                            <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Tel du destinataire</h5>
                                            <p className='font-semibold'>+{selectedTransaction.receiverPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTransaction.transferType === 'Bank' && (
                                <div className='mt-6 bg-gray-50 p-4 rounded-lg space-y-4'>
                                    <h4 className='font-semibold text-primary'>Bank Details</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>Banque destinataire</h5>
                                            <p className='font-semibold'>{selectedTransaction.receiverBankName}</p>
                                        </div>
                                        <div>
                                            <h5 className='text-sm font-medium text-gray_dark/70 mb-1'>IBAN code</h5>
                                            <p className='font-mono font-medium'>{selectedTransaction.receiverBankIban}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer section */}
                        <div className='sticky bottom-0 bg-white px-6 py-4 flex justify-between border-t border-gray-100'>
                            <button
                                onClick={validateTransaction}
                                className='w-full md:w-auto bg-green hover:bg-green/90 transition-colors duration-200 text-white px-6 py-2.5 rounded-lg font-medium'
                            >
                                Validate
                            </button>
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className='w-full md:w-auto bg-primary hover:bg-primary/90 transition-colors duration-200 text-white px-6 py-2.5 rounded-lg font-medium'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionListAdmin;