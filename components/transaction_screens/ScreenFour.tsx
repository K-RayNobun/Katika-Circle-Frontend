import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


//Redux related imports
import { useAppDispatch } from '@/lib/redux/hooks';
import { provideStatus } from '@/lib/redux/features/transaction/transactionSlice';

interface screenProps {
  onClose: () => void,
  nextScreen: () => void,
}

const handleSubmit = (e: React.FormEvent) => {
    const dispatch = useAppDispatch();
    dispatch(provideStatus('completed'));
}

const ScreenFour = ({onClose, nextScreen}: screenProps) => {
  return (
    <div className='lg:h-[238px] w-full h-[90%] lg:max-w-[552px] bg-white rounded-t-[12px] lg:rounded-[12px] p-[44px] flex flex-col gap-[12px]'>
        <div className='hidden lg:flex w-full justify-end items-center'>
        <button onClick={onClose}><FontAwesomeIcon icon={faXmark} className='h-[24px]' /></button>
        </div>
        <div className='relative grow flex flex-col justify-evenly items-center'>
          <h4 className='text-center text-[20px] leading-[24px] font-bold text-primary_dark'>Transaction effectuée</h4>
          <DotLottieReact className='h-[120px]'
            src="https://lottie.host/86a1b122-d6b3-42b1-8237-a935097e293b/ZsVDaZTV99.lottie"
            autoplay
            speed={0.75}
          />
        </div>
        <h5>We&apos;ve sent a verification code to your email. Enter it below to complete your login</h5>
        <button type='submit' onClick={handleSubmit} className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
            <h6 className='text-center font-bold '>Retour à l'acceuil</h6>
        </button>
    </div>
  )
}

export default ScreenFour