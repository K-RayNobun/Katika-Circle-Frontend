import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAppSelector } from '@/lib/redux/hooks';

interface AwardsStatsProps {
    referralBonus: number;
    filleulCount: number;
}

const AwardsStats = ({ referralBonus, filleulCount }: AwardsStatsProps) => {
    const { t } = useTranslation();
    const userCurrency = useAppSelector((state) => state.user.currencySymbol);

    let referralBonusFormatted = '0';

    try {
        referralBonusFormatted = referralBonus.toLocaleString('en-US');
    }
    catch (error) {
        console.error('Error formatting referral bonus:', error);
        referralBonusFormatted = '0';
    }

    return (
        <div className='w-full flex gap-[32px] animate-fading-1'>
            {/* Referral Bonus */}
            <div className='flex justify-center lg:justify-between items-center flex-1 px-[8px] lg:px-[32px] rounded-[12px] border-2 bg-pink/20 border-pink min-h-[120px]'>
                <div className='font-bold flex flex-col'>
                    <div className='flex justify-center gap-[8px] text-pink'>
                        <span className='text-[16px] lg:text-[16px] mt-2'>{`${userCurrency}`}</span>
                        <span className='text-[32px] lg:text-[36px] font-extrabold'>{`${referralBonusFormatted}`}</span>
                    </div>
                    <div className='text-[14px] text-pink font-semibold mx-[10px] text-center'>
                        {`${t('referralBonus')}`}
                    </div>
                    <button className='mt-[8px] hidden lg:flex justify-center text-white text-[16px] px-[18px] py-[10px] rounded-[4px] bg-pink'>
                        {t('claimBonus')}
                    </button>
                </div>
                <Image src="/awards/money.svg" alt="Money image" width={250} height={150} className='hidden lg:block mt-[-12px] w-[250px]' />
            </div>

            {/* Filleuls Count */}
            <div className='flex justify-center lg:justify-between items-center flex-1 px-[8px] lg:px-[32px] rounded-[12px] border-2 bg-primary/20 border-primary min-h-[120px]'>
                <div className='text-primary font-bold text-center flex flex-col items-center '>
                    <div className='flex items-start'>
                        <h3 className='text-[32px] lg:text-[64px] font-extrabold'>{filleulCount}</h3>
                    </div>
                    <div className='text-[14px] lg:text-[24px] font-semibold mx-[10px] text-center'>
                        {`${t('filleuls')}`}
                    </div>
                </div>
                <Image src="/awards/people.svg" alt="People image" width={250} height={150} className='hidden lg:block mr-[100px] w-[140px]' />
            </div>
        </div>
    );
};

export default AwardsStats;