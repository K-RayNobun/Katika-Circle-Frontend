import React, {useState, useEffect} from 'react';
import { RiSendPlaneLine } from "react-icons/ri";
import { MdOutlinePending } from "react-icons/md";
import { VscError } from "react-icons/vsc";

import axios from 'axios';

import { useTranslation } from '@/lib/hooks/useTranslation';

//Redux related imports
import { useAppDispatch } from '@/lib/redux/hooks';
import { provideCashback } from '@/lib/redux/features/user/userSlice';

// Differentt status types: complete, pending, failed
interface notificationDetails {
  status: string,
  date: string,
  amountReceived: number,
  amountSent: number,
  currencySent: string,
}

interface Transaction {
  creationDate: string;
  transactionStatus: string;
  amount: number;
  currency: string;
  recipient: {
    amountReceive: number;
  };
  cashBack: {
    amount: number;
  };
}

const handleStatus = (status:string) => {
  let style = {
    bgColor: '',
    textColor: '',
    icon: <MdOutlinePending size={20} />
  }
  return (
  status.toLowerCase() === 'success' ? style = {
    bgColor: 'bg-[#EDFFEC]',
    textColor: 'text-[#009646]',
    icon: <RiSendPlaneLine className='size-[20px] ml-[-6px]' />
  } :
  status.toLowerCase() === 'pending' ? 
  style = {
    bgColor: 'bg-[#FFE9DB]',
    textColor: 'text-[#FF5C00]',
    icon: <MdOutlinePending className='size-[20px]' />
  } :
  status.toLowerCase()  === 'failed' ?
  style = {
    bgColor: 'bg-[#FFECEC]',
    textColor: 'text-[#FF0004]',
    icon: <VscError className='size-[20px]' />
  } : style
);
}

const Notification = ({details}:{details: notificationDetails}) => {
  const { t } = useTranslation();
  const style = handleStatus(details.status);
  
  return (
    <div className='w-full bg-gray p-[16px] rounded-[12px]'>
        <h5 className='text-[10px] text-gray_dark/60 font-semibold'>{details.date}</h5>
        <div className='flex w-full mt-[10px] justify-between'>
            <div className='flex items-center gap-[8px]'>
                <div className={`size-[40px] rounded-full flex items-center justify-center pl-[-6px] ${style.bgColor} ${style.textColor}`}>
                    {style.icon}
                </div>
                <h4 className={`text-[14px] font-bold ${style.textColor}`}>
                    {t(`notifications.status.${details.status.toLowerCase()}`)}
                </h4>
            </div>
            <div className='flex flex-col items-end'>
                <h5 className='text-[14px] text-primary_dark font-bold'>
                    {t('notifications.currency.default')} {details.amountReceived.toLocaleString('en-US')}
                </h5>
                <h5 className='text-[10px] text-gray_dark/60 font-semibold'>
                    {details.amountSent} {details.currencySent}
                </h5>
            </div>
        </div>
    </div>
  );
}

const NotificationList = ({accessToken, rate}:{accessToken:string, rate:number}) => {
  const [transactionsList, setTransactionsList] = useState<Array<notificationDetails>>([]);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const displayedStatuses = ['Pending', 'Success', 'Failed'];

  useEffect(() => {
    const fecthTransactionList = async () => {
        try {
          let cashbackTotal = 0;
            // console.log('------------------ Getting Transactions --------------')
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions/user`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            )
  
            // console.log('We got this list of transactions: ', response.data.data);
            const fetchedList: Transaction[] = response.data.data.slice().reverse();
            const transactionArray: notificationDetails[] = [];

            fetchedList.forEach((transaction: Transaction) => {
              const creationDate = new Date(transaction.creationDate);
              const userTransaction: notificationDetails = {
                status: transaction.transactionStatus,
                date: creationDate.toLocaleString('en-US'),
                amountSent: transaction.amount,
                currencySent: transaction.currency.toLowerCase() === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase(),
                amountReceived: transaction.recipient.amountReceive,
              };

              const cashback = (transaction.cashBack ? transaction.cashBack.amount : 0);
              if (cashback) {
                cashbackTotal += cashback;
              }

              transactionArray.push(userTransaction);
            });
            setTransactionsList(transactionArray);
            dispatch(provideCashback(cashbackTotal));
            // console.log('---- Total Cashback is ', cashbackTotal);
            // console.log('----------------- Finished Getting transactions --------------');
        } catch{
            // console.error('We met this error  while getting the transaction list: ', error)
        }
    }
  
    fecthTransactionList();
  }, [accessToken, dispatch, rate])

  return (
    <div className={`w-full grow`}>
      <h4 className='text-primary_dark font-bold mb-3'>
        {t('notifications.title')}
      </h4>
      <div className='max-h-[450px] space-y-[16px] py-[6px] overflow-y-auto'>
        { transactionsList.length >= 1 ?
          transactionsList.map((transaction, i) => {
            if(!displayedStatuses.includes(transaction.status)) {
              return
            }
            return <Notification key={i} details={transaction}/>
          }) :
          <div className='w-full bg-gray p-[32px] rounded-[12px]'>
            <h5 className='text-[16px] text-gray_dark font-semibold items-center justify-center flex'>
              {t('notifications.noTransactions')}
            </h5>
          </div>
        }
      </div>
    </div>
  )
}

export default NotificationList
