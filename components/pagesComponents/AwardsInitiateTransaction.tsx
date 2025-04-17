import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface AwardsInitiateTransactionProps {
    setIsScreenVisible: (isScreenVisible:boolean) => void;
}

const AwardsInitiateTransaction = ({setIsScreenVisible}: AwardsInitiateTransactionProps) => {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col bg-primary w-full rounded-[12px] gap-[6px] p-[16px]'>
            <div className='flex'>
                <div className='flex flex-col gap-[8px] text-white'>
                    <h4 className='text-[16px] font-bold'>{t('awardsInitiateTransaction.timeToTransfer')}</h4>
                    <p className='text-[12px] font-light'>
                        {t('awardsInitiateTransaction.readyToTransfer')}
                    </p>
                </div>
                <Image src='/awards/spacerocket.svg' width={60} height={100} alt='spacerocket' className='h-[100px] mb-[6px]' />
            </div>
            <button onClick={() => setIsScreenVisible(true)} className='bg-white rounded-[4px] py-[10px] px-[18px] w-full text-primary font-bold pulse-glow'>
                {t('awardsInitiateTransaction.sendMoney')}
            </button>
        </div>
    );
};

export default AwardsInitiateTransaction;