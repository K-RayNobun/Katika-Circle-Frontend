import React from 'react';
import Image from 'next/image';

interface AwardsCashbackProps {
    cashbackGain: number;
}

const AwardsCashback = ({ cashbackGain }: AwardsCashbackProps) => {
    return (
        <div className='bg-indigo/20 rounded-[12px] p-[12px] gap-[8px] border-2 border-indigo flex flex-col items-center'>
            <div className="flex items-center justify-between w-[90%]">
                <Image src='/awards/phonepay.png' alt='Phonepay' className='h-[100px] mb-[6px]' />
                <div className="flex flex-col items-end text-indigo">
                    <h5 className='font-bold flex items-start'>
                        <span className='text-[16px]'>XAF</span>
                        <span className='text-[36px]'>{cashbackGain}</span>
                    </h5>
                    <h5 className='font-bold text-[14px]'>Cashback disponibles</h5>
                </div>
            </div>
            <button className='px-[18px] py-[10px] w-full bg-indigo text-white rounded-[4px]'>
                Convertir en Transaction
            </button>
        </div>
    );
};

export default AwardsCashback;