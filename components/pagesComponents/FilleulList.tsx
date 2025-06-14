import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAppSelector } from '@/lib/redux/hooks';

interface FilleulDetails {
    order: number,
    referralCode: string,
    commission: number,
    bonusClaimed: boolean,
}

const FilleulInfo = ({ details }: { details: FilleulDetails }) => {
    // const { t } = useTranslation();
    const userCurrency = useAppSelector((state) => state.user.currencySymbol);
    
    return (
        <div className={`flex justify-between items-center w-full bg-gray rounded-[6px] px-[16px] py-[12px] text-[14px] text-primary_dark`}>
            <h5 className={``}>{details.order}</h5>
            <div className={`grow px-[20px]`}>
                <h5 className={`flex-4 grow-4`}>{details.referralCode}</h5>
            </div>
            <h5 className={`font-bold `}>
                {userCurrency} {details.commission}
            </h5>
        </div>
    )
};

interface FilleulListProps {
    filleulList: FilleulDetails[];
}

const FilleulList = ({ filleulList }: FilleulListProps) => {
    const { t } = useTranslation();
    
    return (
        <div className={`grow bg-white rounded-[12px] px-2 py-[16px] space-y-[20px]`}>
            <h4 className={`text-primary_dark font-bold`}>
                {t('filleulList.myReferrals')}
            </h4>
            <div className={`max-h-[720px] overflow-auto space-y-[20px]`}>
                { filleulList.length > 0 ?  
                    <div>
                        {
                            filleulList.map((filleul, i) => {
                                return <div key={i} className='my-[12px]'><FilleulInfo details={filleul} /></div>
                            })
                        }
                    </div>
                : <div className={`flex justify-center items-center w-full h-[80px] text-primary font-semibold bg-gray rounded-[12px]`}>
                        <h5 className={`text-[14px] text-gray_dark`}>{t('filleulList.noReferrals')}</h5> 
                    </div>}
            </div>
        </div>
    );
};

export default FilleulList;