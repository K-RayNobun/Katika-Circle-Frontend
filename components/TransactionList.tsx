import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock} from '@fortawesome/free-regular-svg-icons'
import { faBan, faArrowDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';


// Redux related imports
import { useDispatch } from 'react-redux';
import { provideCashback } from '@/lib/redux/features/user/userSlice';


interface transactionDetails {
  order: number,
  status: string, // Differentt status types: complete, pending, failed
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

const handleStatus = (status:string) => {
  let style = {
    bgColor: '',
    textColor: '',
    icon: <FontAwesomeIcon icon={faPaperPlane} />
  }
  return (
  status.toLowerCase() === 'success' ? style = {
    bgColor: 'bg-[#EDFFEC]',
    textColor: 'text-[#009646]',
    icon: <FontAwesomeIcon className='size-[20px]' icon={faPaperPlane} />
  } :
  status.toLowerCase() === 'pending' ? 
  style = {
    bgColor: 'bg-[#FFE9DB]',
    textColor: 'text-[#FF5C00]',
    icon: <FontAwesomeIcon className='size-[24px]' icon={faClock} />
  } :
  status.toLowerCase()  === 'failed' ?
  style = {
    bgColor: 'bg-red/20',
    textColor: 'text-[#FF0004]',
    icon: <FontAwesomeIcon className='size-[24px]' icon={faBan} />
  } : style
);
}

const Transaction = ({details, }:{details: transactionDetails}) => {

  const style = handleStatus(details.status);
    return (
    <div>
      <tr className='hidden lg:flex w-full h-[72px] items-center text-center bg-white border-[#EAECF0] border-b text-[14px] font-bold px-[24px]'>
        <td className='w-[22%] px-[12px] '><h5 className='text-[#AFB4C0]'>{details.date}</h5></td>
        <td className='w-[30%] px-[12px]'><h5 >{details.destinatoryName}</h5></td>
        <td className='w-[14%] px-[12px]'><h5 >{details.amountSent}</h5></td>
        <td className='w-[20%] px-[12px] flex items-center justify-center'><h4 className={` font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px]  ${style.textColor + ' ' + style.bgColor}`}>{details.status}</h4></td>
        <td className='w-[14%] px-[12px]'>{details.cashbackGain || 0}</td>                
      </tr>
      <tr className='flex flex-col items-start lg:hidden w-full bg-white border-[#EAECF0] border-b rounded-[8px] text-[14px] font-bold px-[24px] py-[7px]'>
        <td className='font-light'><h5 className='text-[#AFB4C0]'>{details.date}</h5></td>
        <div className='flex items-center w-full'>
          <div className={`lg:hidden h-[40px] mt-[-30px] text-[16px] rounded-full flex items-center justify-center ${style.bgColor} ${style.textColor} `}>
            {style.icon}
          </div>
          <div>
            <td className='w-[30%] px-[12px]'><h5 className='text-[12px]' >{details.destinatoryName}</h5></td>
            <td className='w-[20%] px-[12px] flex items-center'><h4 className={` font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px]  ${style.textColor}`}>{details.status}</h4></td>
          </div>
          <div className='grow'></div>
          <td className='w-[14%] px-[12px]'><h5 >{details.amountSent}</h5></td>
        </div>
      </tr>
    </div>
    );
}

const TransactionList = ({accessToken, searchKey, field}:{accessToken:string, searchKey: string, field:keyof transactionDetails}) => {
  const dataLength = 12;
  const [transactionsList, setTransactionsList] = useState<Array<transactionDetails>>([]);
  const [searchResultList, setSearchResultList] = useState<Array<transactionDetails>>([]);
  const dispatch = useDispatch();
  console.log('Seacrh Key is', searchKey);
  console.log('Field concerned is', field);

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
              const transactionArray:Array<transactionDetails> = [];
              fetchedList.forEach((transaction: Transaction, index: number) => {
                const creationDate = new Date(transaction.creationDate);
                console.log('Transaction status is ', transaction.transactionStatus + 'And it cashback is', transaction.cashBack.amount)
                const userTransaction: transactionDetails = {
                  order: index,
                  status: transaction.transactionStatus,
                  date: creationDate.toLocaleString('en-US'),
                  amountSent: transaction.amount,
                  currencySent: transaction.currency.toLowerCase() === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase() ,
                  destinatoryName: transaction.recipient.name,
                  cashbackGain: transaction.transactionStatus === 'Success' ? transaction.cashBack.amount : 0,
                }
  
                const cashback = transaction.cashBack.amount;
                if (cashback) {
                  cashbackTotal += cashback;
                }
                dispatch(provideCashback(cashbackTotal))
                
                transactionArray.push(userTransaction);
                
              })
              setTransactionsList(transactionArray);
              console.log('----------------- Finished Getting transactions --------------');
          } catch(error) {
              console.error('We met this error  while getting the transaction list', error)
          }
      }
      fecthTransactionList();
    }, [accessToken]);

    useEffect(() => {
      // console.log('A Transaction amount is ', transactionsList[0].amountSent)
      if (searchKey.length > 0) {
        const transactionArray: Array<transactionDetails> = [];
        transactionsList.forEach((transaction) => {
          if (transaction[field].toString().toLowerCase().includes(searchKey.toLowerCase())) {
              console.log('Found it in the transaction sent to ', transaction.destinatoryName + ' on ' + transaction.date);
              transactionArray.push(transaction);
          }
          setSearchResultList(transactionArray);
        })
      }
    }, [searchKey, field, transactionsList])

    

  return (
    <div className={`grow w-full overflow-auto`}>
        <table className='flex flex-col w-full mb-[50px]'>
          <thead>
              <tr className='hidden lg:flex w-full bg-[#F9FAFB]  text-gray_dark py-[12px] px-[24px] border border-[#EAECF0]'>
                  <th className='w-[22%] px-[12px]'>Date et Heure <FontAwesomeIcon size='sm' icon={faArrowDown} className='ml-1'/></th>
                  <th className='w-[30%] px-[12px]'>Destinataire</th>
                  <th className='w-[14%] px-[12px]'>Montant envoyé</th>
                  <th className='w-[20%] px-[12px]'>Statut de la transaction</th>
                  <th className='w-[14%] px-[12px]'>Cashback généré</th>
              </tr>
          </thead>
          <tbody>
            <tr className='block h-full w-full space-y-[16px] lg:space-y-[0px] overflow-auto'>
              { searchKey.length === 0 ?
              transactionsList.map((transaction, i) => {
                  return <Transaction key={i} details={transaction}/>
                })
              :
              searchResultList.map((transaction, i) => {
                return <Transaction key={i} details={transaction}/>
              })
              }
            </tr>
          </tbody>
        <button className={`${dataLength > 10 ? 'hidden lg:block' : 'hidden'} w-full bg-[#F9FAFB] py-[16px] hover:bg-gray rounded-b-[8px]'`}><h5 className='text-center'>Voir plus</h5></button>
      </table>
    </div>
  )
}

export default TransactionList
