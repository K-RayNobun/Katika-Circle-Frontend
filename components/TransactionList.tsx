import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock} from '@fortawesome/free-regular-svg-icons'
import { faBan, faArrowDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons'


interface transactionDetails {
  status: string, // Differentt status types: complete, pending, failed
  date: string,
  destinatoryName: string,
  amountSent: number,
  cashbackGain: number,
}
const customTransactionDetails = {
    status: 'Réussie',
    date: 'Lun 3 à 11:02',
    destinatoryName: 'Zain Culhane',
    cashbackGain: 0.01,
    amountSent: 120,
}

const handleStatus = (status:string) => {
  let style = {
    bgColor: '',
    textColor: '',
    icon: <FontAwesomeIcon icon={faPaperPlane} />
  }
  return (
  status.toLowerCase() === 'réussie' ? style = {
    bgColor: 'bg-[#EDFFEC]',
    textColor: 'text-[#009646]',
    icon: <FontAwesomeIcon icon={faPaperPlane} />
  } :
  status.toLowerCase() === 'en cours' ? 
  style = {
    bgColor: 'bg-[#FFE9DB]',
    textColor: 'text-[#FF5C00]',
    icon: <FontAwesomeIcon icon={faClock} />
  } :
  status.toLowerCase()  === 'echouée' ?
  style = {
    bgColor: 'bg-[#D3FFDA]',
    textColor: 'text-[#FF0004]',
    icon: <FontAwesomeIcon className='size-[32px]' icon={faBan} />
  } : style
);
}

const Transaction = ({details}:{details: transactionDetails}) => {

  const style = handleStatus(details.status);
    return (
    <div>
      <tr className='hidden lg:flex w-full h-[72px] items-center bg-white border-[#EAECF0] border-b text-[14px] font-bold px-[24px]'>
        <td className='w-[22%] px-[12px] '><h5 className='text-[#AFB4C0]'>{details.date}</h5></td>
        <td className='w-[30%] px-[12px]'><h5 >{details.destinatoryName}</h5></td>
        <td className='w-[14%] px-[12px]'><h5 >{details.amountSent}</h5></td>
        <td className='w-[20%] px-[12px] flex items-center'><h4 className={` font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px]  ${style.textColor+' '+style.bgColor}`}>{details.status}</h4></td>
        <td className='w-[14%] px-[12px]'>{details.cashbackGain}</td>                
      </tr>
      <tr className='flex flex-col items-start lg:hidden w-full bg-white border-[#EAECF0] border-b rounded-[8px] text-[14px] font-bold px-[24px] py-[7px]'>
        <td className='font-light'><h5 className='text-[#AFB4C0]'>{details.date}</h5></td>
        <div className='flex items-center w-full'>
          <div className={`lg:hidden size-[40px] rounded-full flex items-center justify-center px-[24px] ${style.bgColor} ${style.textColor} `}>
            {style.icon}
          </div>
          <div>
            <td className='w-[30%] px-[12px]'><h5 >{details.destinatoryName}</h5></td>
            <td className='w-[20%] px-[12px] flex items-center'><h4 className={` font-bold text-[12px] text-center rounded-[16px] h-[24px] w-[72px]  ${style.textColor}`}>{details.status}</h4></td>
          </div>
          <div className='grow'></div>
          <td className='w-[14%] px-[12px]'><h5 >{details.amountSent}</h5></td>
        </div>
      </tr>
    </div>
    );
}

const TransactionList = () => {
  const dataLength = 12;
  return (
    <div className={`grow w-full overflow-auto`}>
        <table className='flex flex-col w-full mb-[50px]'>
            <tr className='hidden lg:flex w-full bg-[#F9FAFB]  text-gray_dark py-[12px] px-[24px] border border-[#EAECF0]'>
                <thead className='w-[22%] px-[12px]'>Date et Heure <FontAwesomeIcon size='sm' icon={faArrowDown} className='ml-1'/></thead>
                <thead className='w-[30%] px-[12px]'>Destinataire</thead>
                <thead className='w-[14%] px-[12px]'>Montant envoyé</thead>
                <thead className='w-[20%] px-[12px]'>Statut de la transaction</thead>
                <thead className='w-[14%] px-[12px]'>Cashback généré</thead>
            </tr>
        <div className='h-full w-full space-y-[16px] lg:space-y-[0px] overflow-auto'>
          {
            Array.from({length: dataLength}, (_, i) => {
              return <Transaction key={i} details={customTransactionDetails}/>
            })
          }
        </div>
        <button className={`${dataLength > 10 ? 'hidden lg:block' : 'hidden'} w-full bg-[#F9FAFB] py-[16px] hover:bg-gray rounded-b-[8px]'`}><h5 className='text-center'>Voir plus</h5></button>
      </table>
    </div>
  )
}

export default TransactionList
