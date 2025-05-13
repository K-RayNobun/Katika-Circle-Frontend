import React, { useState, useEffect } from 'react'
import { RiSendPlaneLine } from "react-icons/ri";
import { MdOutlinePending, MdOutlineArrowDownward } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import AsyncSpinner from './AsyncSpinner';
import { ErrorMessage } from './ErrorComponent';

// Redux related imports
import { useDispatch } from 'react-redux';
import { provideCashback } from '@/lib/redux/features/user/userSlice';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useApiGet } from '@/lib/hooks/useApiRequest';

interface transactionDetails {
  order: number,
  status: string, // Different status types: complete, pending, failed
  date: string,
  destinatoryName: string,
  amountSent: number,
  currencySent: string,
  cashbackGain: number,
}

interface Transaction {
  creationDate: string;
  transactionStatus: string;
  amount: number;
  currency: string;
  cashBack: {
    amount: number;
  };
  recipient: {
    name: string;
  };
}

const handleStatus = (status: string) => {
  let style = {
    bgColor: '',
    textColor: '',
    icon: <RiSendPlaneLine />
  }
  return (
    status.toLowerCase() === 'success' ? style = {
      bgColor: 'bg-[#EDFFEC]',
      textColor: 'text-[#009646]',
      icon: <RiSendPlaneLine className='size-[20px]' />
    } :
      status.toLowerCase() === 'pending' ?
        style = {
          bgColor: 'bg-[#FFE9DB]',
          textColor: 'text-[#FF5C00]',
          icon: <MdOutlinePending className='size-[24px]' />
        } :
        status.toLowerCase() === 'failed' ?
          style = {
            bgColor: 'bg-red/20',
            textColor: 'text-[#FF0004]',
            icon: <VscError className='size-[24px]' />
          } : style
  );
}

const Transaction = ({ details }: { details: transactionDetails }) => {
  const { t } = useTranslation();
  const style = handleStatus(details.status);

  return (
    <div>
      <tr className='hidden lg:flex w-full h-[72px] items-center text-center bg-white border-[#EAECF0] border-b text-[14px] font-bold px-[24px]'>
        <td className='w-[22%] px-[12px]'><h5 className='text-[#AFB4C0]'>{details.date}</h5></td>
        <td className='w-[30%] px-[12px]'><h5>{details.destinatoryName}</h5></td>
        <td className='w-[14%] px-[12px]'><h5>{details.amountSent}</h5></td>
        <td className='w-[20%] px-[12px] flex items-center justify-center'>
          <h4 className={`font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px] ${style.textColor + ' ' + style.bgColor}`}>
            {t(`transactionList.status.${details.status.toLowerCase()}`)}
          </h4>
        </td>
        <td className='w-[14%] px-[12px]'>{details.cashbackGain || 0}</td>
      </tr>
      {/* Mobile view */}
      <tr className='flex flex-col items-start lg:hidden w-full bg-white border-[#EAECF0] border-b rounded-[8px] text-[14px] font-bold px-[24px] py-[7px]'>
        <td className='font-light'><h5 className='text-[#AFB4C0] text-[14px]'>{details.date}</h5></td>
        <div className='flex items-center w-full '>
          <div className={`lg:hidden size-[32px] mt-[-10px] text-[16px] rounded-full flex items-center justify-center ${style.bgColor} ${style.textColor} `}>
            {style.icon}
          </div>
          <div>
            <td className='w-[30%] px-[12px]'><h5 className='text-[14px]'>{details.destinatoryName}</h5></td>
            <td className='w-[20%] px-[12px] flex items-center'>
              <h4 className={`font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px] ${style.textColor}`}>
                {t(`transactionList.status.${details.status.toLowerCase()}`)}
              </h4>
            </td>
          </div>
          <div className='grow'></div>
          <td className='w-[14%]'><h5>{details.amountSent}</h5></td>
        </div>
      </tr>
    </div>
  );
}

const TransactionList = ({ accessToken, searchKey, field }: { accessToken: string, searchKey: string, field: keyof transactionDetails }) => {
  const { t } = useTranslation();
  const dataLength = 12;
  const [transactionsList, setTransactionsList] = useState<Array<transactionDetails>>([]);
  const [searchResultList, setSearchResultList] = useState<Array<transactionDetails>>([]);
  const { fetchData, isLoading, error } = useApiGet<Transaction[]>();
  const dispatch = useDispatch();
  const displayedStatuses = ['Pending', 'Success', 'Failed'];
  // console.log('Search Key is', searchKey);
  // console.log('Field concerned is', field);

  useEffect(() => {
    const fecthTransactionList = async () => {
        let cashbackTotal = 0;
        // console.log('------------------ Getting Transactions --------------')
        
        // console.log('We got this list of transactions: ', response.data.data);
        const result = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions/user`) as Transaction[];
        const fetchedList = result!.slice().reverse();
        const transactionArray: Array<transactionDetails> = [];
        fetchedList.forEach((transaction: Transaction, index: number) => {
          let creationDate = '';

          try {
            creationDate = new Date(transaction.creationDate).toLocaleString('en-US');
          }
          catch (error) {
            console.error('Error parsing creation date: ', error);
            creationDate = 'Invalid date';
          }
          // console.log('Transaction status is ', transaction.transactionStatus + 'And it cashback is', transaction.cashBack)
          const userTransaction: transactionDetails = {
            order: index,
            status: transaction.transactionStatus,
            date: creationDate,
            amountSent: transaction.amount,
            currencySent: transaction.currency.toLowerCase() === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase(),
            destinatoryName: transaction.recipient.name,
            cashbackGain: transaction.cashBack ? transaction.cashBack.amount : 0,
          }

          if (!displayedStatuses.includes(userTransaction.status)) {
            return
          }

          const cashback =  transaction.cashBack ? transaction.cashBack.amount : 0;
          if (cashback) {
            cashbackTotal += cashback;
          }
          dispatch(provideCashback(cashbackTotal))

          transactionArray.push(userTransaction);
          // console.log('The transaction array is: ', transactionArray);
        })
        console.log(' The list of ransactions is: ', transactionArray);
        setTransactionsList(transactionArray);
        // console.log(`Transactions list is ${transactionArray}`)
        // console.log('----------------- Finished Getting transactions --------------');
      
    }

    fecthTransactionList();
  }, [accessToken]);

  useEffect(() => {
    if (searchKey.length > 0) {
      const transactionArray: Array<transactionDetails> = [];
      transactionsList.forEach((transaction) => {
        if (transaction[field].toString().toLowerCase().includes(searchKey.toLowerCase())) {
          // console.log('Found it in the transaction sent to ', transaction.destinatoryName + ' on ' + transaction.date);
          transactionArray.push(transaction);
        }
        setSearchResultList(transactionArray);
      })
    }
  }, [searchKey, field, transactionsList])

  if (isLoading) {
    return <AsyncSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!transactionsList || transactionsList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('transactionList.noTransactions')}
      </div>
    )
  }

  return (
    <div className={`grow w-full overflow-auto`}>
      <table className='flex flex-col w-full mb-[50px]'>
        <thead className='hidden lg:block'>
            <tr className='w-full lg:flex items-center bg-[#F9FAFB] text-gray_dark py-[12px] px-[24px] border border-[#EAECF0]'>
            <th className='w-[22%] px-[12px flex justify-center gap-[16px]'> <h2>{t('transactionList.table.date')}</h2> <MdOutlineArrowDownward size='24px' className='ml-1' /></th>
            <th className='w-[30%] px-[12px]'>{t('transactionList.table.recipient')}</th>
            <th className='w-[14%] px-[12px] text-[14px]'>{t('transactionList.table.amountSent')}</th>
            <th className='w-[20%] px-[12px] text-[14px]'>{t('transactionList.table.status')}</th>
            <th className='w-[14%] px-[12px] text-[14px]'>{t('transactionList.table.cashback')}</th>
            </tr>
        </thead>
        {
          transactionsList.length > 0 ?
            <tbody>
              <tr className='block h-full w-full space-y-[16px] lg:space-y-[0px] overflow-auto'>
                {
                  searchKey.length === 0 ?
                    transactionsList.map((transaction, i) => {
                      return <Transaction key={i} details={transaction} />
                    })
                    :
                    searchResultList.map((transaction, i) => {
                      return <Transaction key={i} details={transaction} />
                    })
                }
              </tr>
              <button className={`${dataLength > 10 ? 'hidden lg:block' : 'hidden'} w-full bg-[#F9FAFB] py-[16px] hover:bg-gray rounded-b-[8px]'`}><h5 className='text-center'>Voir plus</h5></button>
            </tbody>
            :
            <tbody className='w-full flex justify-center p-[32px] rounded-[12px]'>
              <tr className=' w-full'>
                <h5 className='text-[16px] text-center text-gray_dark font-semibold items-center justify-center flex'>
                  {t('transactionList.noTransactions')}
                </h5>
              </tr>
            </tbody>
        }
      </table>
    </div>
  )
}

export default TransactionList
