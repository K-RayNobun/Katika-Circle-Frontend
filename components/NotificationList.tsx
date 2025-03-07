import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faClock} from '@fortawesome/free-regular-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'
// Differentt status types: complete, pending, failed
interface notificationDetails {
  status: string,
  date: string,
  amountReceived: number,
  amountSent: number,
}
const customNotificationDetails = {
    status: 'Pending',
    date: 'Mar 4 at 10:04 AM',
    amountReceived: 65000,
    amountSent: 100,
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
        <h5 className='text-[10px] text-gray_dark/60'>Mar 4 at 10:04 AM</h5>
        <div className='flex w-full mt-[10px] justify-between'>
            <div className='flex items-center gap-[8px]'>
                <div className={`size-[40px] rounded-full flex items-center justify-center ${style.bgColor} ${style.textColor} `}>
                  {style.icon}
                </div>
                <h4 className={`text-[14px] font-bold ${style.textColor}`}>{details.status}</h4>
            </div>
            <div className='flex flex-col items-end'>
                <h5 className='text-[14px] text-primary_dark font-bold'>XAF {details.amountReceived}</h5>
                <h5 className='text-[10px] text-gray_dark/60'>{details.amountSent} EUR</h5>
            </div>
        </div>
    </div>);
}

const NotificationList = () => {
  return (
    <div className={`w-full grow`}>
      <h4 className='text-primary_dark font-bold mb-3'>Notifications</h4>
      <div className='max-h-[450px] space-y-[16px] py-[6px] overflow-y-auto'>
        {
          Array.from({length: 8}, (_, i) => {
            return <Notification key={i} details={customNotificationDetails}/>
          })
        }
      </div>
    </div>
  )
}

export default NotificationList
