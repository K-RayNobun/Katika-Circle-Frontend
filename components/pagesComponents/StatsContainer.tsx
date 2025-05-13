import React from 'react';
import { RiHandCoinLine } from "react-icons/ri";
import { TbUserHeart } from "react-icons/tb";
import { GrGroup } from "react-icons/gr";
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAppSelector } from '@/lib/redux/hooks';

interface FilleulDetails {
    order: number;
    name: string;
    commission: number;
    bonusClaimed: boolean;
}

const StatsContainer = ({ userData, referralBonus, filleulList }: {userData: { cashback: number }, referralBonus:number, filleulList: Array<FilleulDetails>}) => {
    const { t } = useTranslation();
    const userCurrency = useAppSelector((state) => state.user.currencySymbol);
    let userCashback = '0';

    try {
        userCashback = userData.cashback.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    catch ( error) {
        console.error('Error formatting cashback:', error);
        userCashback = '0';
    }

    let referralBonusFormatted = '0';

    try {
        referralBonusFormatted = referralBonus.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    catch (error) {
        console.error('Error formatting referral bonus:', error);
        referralBonusFormatted = '0';
    }

    return (
        <div className={`animate-fading-2 flex w-full h-[204px] gap-[4%] my-[20px] lg:my-[32px]`}>
            <div className={`bg-indigo/10 border-2 border-indigo flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-indigo h-full font-bold rounded-[12px] w-full max-w-[32%] flex-1`}>
                <RiHandCoinLine className={` size-[24px] mb-[6px]`} />
                <div className={`text-indigo font-bold flex items-start`}>
                    <span className={`text-[14px] lg:text-[16px]`}>{userCurrency}</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{userCashback}</span>
                </div>
                <div className={`text-[12px] mx-[10px] text-center`}>{t('statsContainer.cashbackAvailable')}</div>
                <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-indigo hover:vibrant-animation hover:animate-tingle`} >
                    {t('statsContainer.details')}
                </button>
            </div>
            <div className={`bg-[#E673D5]/10 border-2 border-[#E673D5] flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-[#E673D5] font-bold w-full max-w-[32%] rounded-[12px] flex-1`}>
                <TbUserHeart className={` size-[24px] mb-[6px]`} />
                <div className={`flex items-start`}>
                    <span className={`text-[14px] lg:text-[16px] mt-2`}>{userCurrency}</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{referralBonusFormatted}</span>
                </div>
                <div className={`text-[12px] mx-[10px] text-center`}>{t('statsContainer.referralBonus')}</div>
                <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-[#E673D5] focus:animate-tingle scale-110 duration-300`} >
                    {t('statsContainer.claim')}
                </button>
            </div>
            <div className={`bg-primary/10 border-2 border-primary flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-primary font-bold rounded-[12px] w-full max-w-[32%] flex-1`}>
                <GrGroup className={` size-[24px] mb-[6px]`} />
                <div>
                    <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{filleulList.length}</span>
                </div>
                <div className={`text-[12px] mx-[10px] text-center`}>{t('statsContainer.referrals')}</div>
                <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-primary hover:animate-tingle`} >
                    {t('statsContainer.details')}
                </button>
            </div>
        </div>
    );
};

export default StatsContainer;