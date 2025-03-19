import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { initiateTransaction } from '@/lib/redux/features/transaction/transactionSlice';

interface screenProps {
  onClose: () => void,
  nextScreen: () => void,
}

const ScreenFour = ({onClose, nextScreen}: screenProps) => {
  return (
    <div className='lg:h-[168px] w-full h-[90%] lg:min-w-[552px] bg-white rounded-t-[12px] lg:rounded-[12px] p-[44px] flex flex-col gap-[32px]'>
        <div className='hidden lg:flex w-full justify-end items-center'>
        <button onClick={onClose}><FontAwesomeIcon icon={faXmark} className='h-[24px]' /></button>
        </div>
        <div className='grow flex flex-col justify-center'>
          <h4 className='text-center text-[20px] leading-[24px] font-bold text-primary_dark'>Transaction effectuée</h4>
          <h5>We&apos;ve sent a verification code to your email. Enter it below to complete your login</h5>
        </div>
        <button type='submit' onClick={onClose} className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
            <h6 className='text-center font-bold '>Retour à l'acceuil</h6>
        </button>
    </div>
  )
}

export default ScreenFour
