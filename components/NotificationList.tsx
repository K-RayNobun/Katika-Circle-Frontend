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

interface Transaction {
  creationDate: string;
  transactionStatus: string;
  amount: number;
  currency: string;
  cashBack: {
    amount: number;
  };
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
            const fetchedList: Transaction[] = response.data.data.slice().reverse();
            const transactionArray: notificationDetails[] = [];

            fetchedList.forEach((transaction: Transaction) => {
              const creationDate = new Date(transaction.creationDate);
              const userTransaction: notificationDetails = {
                status: transaction.transactionStatus,
                date: creationDate.toLocaleString('en-US'),
                amountSent: transaction.amount,
                currencySent: transaction.currency.toLowerCase() === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase(),
                amountReceived: transaction.cashBack.amount * rate,
              };

              const cashback = (transaction.transactionStatus === 'Success' ? transaction.cashBack.amount : 0);
              if (cashback) {
                cashbackTotal += cashback;
              }

              transactionArray.push(userTransaction);
            });
            setTransactionsList(transactionArray);
            dispatch(provideCashback(cashbackTotal));
            console.log('---- Total Cashback is ', cashbackTotal);
            console.log('----------------- Finished Getting transactions --------------');
        } catch {
            console.error('We met this error  while getting the transaction list')
        }
    }
  
    fecthTransactionList();
  }, [accessToken, dispatch, rate])

  return (
    <div className={`w-full grow`}>
      <h4 className='text-primary_dark font-bold mb-3'>Notifications</h4>
      <div className='max-h-[450px] space-y-[16px] py-[6px] overflow-y-auto'>
        { transactionsList.length > 1 ?
          transactionsList.map((transaction, i) => {
            return <Notification key={i} details={transaction}/>
          }) :
          <div className='w-full bg-gray p-[32px] rounded-[12px]'>
            <h5 className='text-[16px] text-gray_dark font-semibold items-center justify-center flex '>No transaction</h5>
          </div>
        }
      </div>
    </div>
  )
}

export default NotificationList
