import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useRouter } from 'next/navigation';

//Redux related imports
import { useAppDispatch } from '@/lib/redux/hooks';
import { provideStatus } from '@/lib/redux/features/transaction/transactionSlice';
import Image from 'next/image';

interface screenProps {
    onClose: () => void,
}

const ScreenFour = ({onClose}: screenProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        dispatch(provideStatus('completed'));
        onClose();
        router.push('/'); // Redirect to home page
    }

    // Display some text in the console
    useEffect(() => {
        console.log(' ------------- ScreenFour component mounted ------------- ');
    }, []);

    return (
        <div className='relative lg:h-[408px] w-full h-[90%] lg:max-w-[552px] bg-white rounded-t-[12px] lg:rounded-[12px] p-[44px] flex flex-col gap-[12px]'>
            <div className='hidden lg:flex absolute top-8 right-8 w-full justify-end items-center'>
                <button 
                    onClick={onClose}
                    title={t('transactionScreens.screenFour.buttons.close')}
                >
                    <FontAwesomeIcon icon={faXmark} className='h-[24px]' />
                </button>
            </div>
            <div className='relative flex flex-col items-center gap-[20px] justify-center'>
                <h4 className='text-center text-[20px] lg:text-[24px] leading-[24px] font-bold text-primary_dark'>
                    {t('transactionScreens.screenFour.title')}
                </h4>
                <DotLottieReact 
                    className='absolute top-[15%] left-1/2 translate-x-[-50%] h-[120px]'
                    src="https://lottie.host/86a1b122-d6b3-42b1-8237-a935097e293b/ZsVDaZTV99.lottie"
                    autoplay
                    speed={0.75}
                />
                {/* Add image */}
                <Image 
                    src={'/successful_transaction.svg'}
                    width={220}
                    height={220} 
                    alt='Successful Transaction'
                    className='w-[220px] h-[220px] object-contain mb-4 lg:mb-0'
                />
            </div>
            <h5 className='text-center text-[16px] mb-5'>
                {t('transactionScreens.screenFour.verificationMessage')}
            </h5>
            <button 
                type='submit' 
                onClick={handleSubmit} 
                className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}
            >
                <h6 className='text-center font-bold'>
                    {t('transactionScreens.screenFour.buttons.backToHome')}
                </h6>
            </button>
        </div>
    )
}

export default ScreenFour