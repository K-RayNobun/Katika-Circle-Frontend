import React from 'react';
import Image from 'next/image';

interface AwardsStatsProps {
    referralBonus: number;
    filleulCount: number;
}

const AwardsStats = ({ referralBonus, filleulCount }: AwardsStatsProps) => {
    return (
        <div className='w-full flex gap-[32px]'>
            {/* Referral Bonus */}
            <div className='flex justify-center lg:justify-between items-center flex-1 px-[8px] lg:px-[32px] rounded-[12px] border-2 bg-pink/20 border-pink min-h-[120px]'>
                <div className='font-bold flex flex-col'>
                    <div className='flex justify-center gap-[8px] text-pink'>
                        <span className='text-[16px] lg:text-[16px] mt-2'>XAF</span>
                        <span className='text-[32px] lg:text-[36px] font-extrabold'>{referralBonus.toLocaleString('en-US')}</span>
                    </div>
                    <div className='text-[14px] text-pink font-semibold mx-[10px] text-center'>Bonus de parrainage</div>
                    <button className='mt-[8px] hidden lg:flex justify-center text-white text-[16px] px-[18px] py-[10px] rounded-[4px] bg-pink'>
                        Reclamer le bonus
                    </button>
                </div>
                <Image src="/awards/money.png" alt="" className='hidden lg:block mt-[-12px] w-[250px]' />
            </div>

            {/* Filleuls Count */}
            <div className='flex justify-center lg:justify-between items-center flex-1 px-[8px] lg:px-[32px] rounded-[12px] border-2 bg-primary/20 border-primary min-h-[120px]'>
                <div className='text-primary font-bold text-center flex flex-col items-center '>
                    <div className='flex items-start'>
                        <h3 className='text-[32px] lg:text-[64px] font-extrabold'>{filleulCount}</h3>
                    </div>
                    <div className='text-[14px] lg:text-[24px] font-semibold mx-[10px] text-center'>Filleuls</div>
                </div>
                <Image src="/awards/people.png" alt="" className='hidden lg:block mr-[100px] w-[140px]' />
            </div>
        </div>
    );
};

export default AwardsStats;