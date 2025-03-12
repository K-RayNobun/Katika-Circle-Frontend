import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faClock} from '@fortawesome/free-regular-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

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

const handleStatus = (status:string) => {
  let style = {
    bgColor: '',
    textColor: '',
    icon: <FontAwesomeIcon icon={faPaperPlane} />
  }
  return (
  status.toLowerCase() === 'completed' ? style = {
    bgColor: 'bg-[#EDFFEC]',
    textColor: 'text-[#009646]',
    icon: <FontAwesomeIcon icon={faPaperPlane} />
  } :
  status.toLowerCase() === 'pending' ? 
  style = {
    bgColor: 'bg-[#FFE9DB]',
    textColor: 'text-[#FF5C00]',
    icon: <FontAwesomeIcon icon={faClock} />
  } :
  status.toLowerCase()  === 'failed' ?
  style = {
    bgColor: 'bg-[#FFECEC]',
    textColor: 'text-[#FF0004]',
    icon: <FontAwesomeIcon className='size-[24px]' icon={faBan} />
  } : style
);
}

const Notification = ({details}:{details: notificationDetails}) => {

  const style = handleStatus(details.status);
    return (
    <div className='w-full bg-gray p-[16px] rounded-[12px]'>
        <h5 className='text-[10px] text-gray_dark/60 font-semibold'>{details.date}</h5>
        <div className='flex w-full mt-[10px] justify-between'>
            <div className='flex items-center gap-[8px]'>
                <div className={`size-[40px] rounded-full flex items-center justify-center ${style.bgColor} ${style.textColor} `}>
                  {style.icon}
                </div>
                <h4 className={`text-[14px] font-bold ${style.textColor}`}>{details.status}</h4>
            </div>
            <div className='flex flex-col items-end'>
                <h5 className='text-[14px] text-primary_dark font-bold'>XAF {details.amountReceived.toLocaleString('en-US')}</h5>
                <h5 className='text-[10px] text-gray_dark/60 font-semibold'>{details.amountSent} {details.currencySent}</h5>
            </div>
        </div>
    </div>);
}

const NotificationList = ({accessToken, rate}:{accessToken:string, rate:number}) => {
  const [transactionsList, setTransactionsList] = useState<Array<notificationDetails>>([]);
  const [cashback, setCashback] = useState<number>(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fecthTransactionList = async () => {
        try {
          let cashbackTotal = 0;
            console.log('------------------ Getting Transactions --------------')
            const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transactions/user`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            )
  
            console.log('We got this list of transactions: ', response.data.data);
            const fetchedList = response.data.data.slice().reverse();
            fetchedList.forEach((transaction, index) => {
              const creationDate = new Date(transaction.creationDate)
              const userTransaction: notificationDetails = {
                status: transaction.transactionStatus,
                date: creationDate.toLocaleString('en-US'),
                amountSent: transaction.amount,
                currencySent: transaction.currency.toLowerCase === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase() ,
                amountReceived: transaction.amount * rate
              }

              const cashback = transaction.cashback;
              if (cashback) {
                setCashback(prev => prev+cashback);
                cashbackTotal += cashback;
              }

              setTransactionsList((prev) => [...prev, userTransaction]);
              
            })
            dispatch(provideCashback(cashbackTotal));
            console.log('----------------- Finished Getting transactions --------------');
        } catch(error) {
            console.error('We met this error  while getting the transaction list')
        }
    }
  
    fecthTransactionList();
  }, [])

  return (
    <div className={`w-full grow`}>
      <h4 className='text-primary_dark font-bold mb-3'>Notifications</h4>
      <div className='max-h-[450px] space-y-[16px] py-[6px] overflow-y-auto'>
        {
          transactionsList.map((transaction, i) => {
            return <Notification key={i} details={transaction}/>
          })
        }
      </div>
    </div>
  )
}

export default NotificationList
