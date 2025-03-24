'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setReferralList } from '@/lib/redux/features/user/userSlice';
import axios, { AxiosError } from 'axios';

import AwardsStats from '@/components/pagesComponents/AwardsStats';
import AwardsCashback from '@/components/pagesComponents/AwardsCashback';
import AwardsInitiateTransaction from '@/components/pagesComponents/AwardsInitiateTransaction';
import FilleulList from '@/components/pagesComponents/FilleulList';
import UserProfile from '@/components/pagesComponents/UserProfile';
import ReferralSection from '@/components/pagesComponents/ReferralSection';
import DialogBox from '@/components/DialogBox';

interface FilleulDetails {
    order: number;
    name: string;
    commission: number;
    bonusClaimed: boolean;
}

const AwardsBoard = () => {
    const [filleulList, setFilleulList] = useState<FilleulDetails[]>([]);
    const [referralBonus, setReferralBonus] = useState(0);
    const [cashbackGain, setCashbackGain] = useState(0);
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.token.token);
    const userData = useAppSelector((state) => state.user);
    const referralCode = userData.referralCode;

    // Referral Code Query Params
    const referralCodeParam = {
        ref_code: referralCode?.toString() || '',
    };
    const queryParams = new URLSearchParams(referralCodeParam).toString();
    

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/referral?code=${referralCode}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    }
                );
                console.log('Referral list is:', response.data.data);
                dispatch(setReferralList(response.data.data));

                let referralGainTotal = 0;
                const filleulArray: FilleulDetails[] = [];

                response.data.data.forEach((referral: { fname: string; lname: string; referral: { bonusTotal: number; bonusStatus: string; } }, index: number) => {
                    const filleul: FilleulDetails = {
                        order: index + 1,
                        name: `${referral.fname} ${referral.lname}`,
                        commission: referral.referral.bonusTotal,
                        bonusClaimed: referral.referral.bonusStatus === 'UNCLAIMED' ? false : true,
                    };

                    if (referral.referral.bonusStatus === 'UNCLAIMED') {
                        referralGainTotal += referral.referral.bonusTotal;
                    }

                    filleulArray.push(filleul);
                });

                setFilleulList(filleulArray);
                setReferralBonus(referralGainTotal);
            } catch (error) {
                const axiosError = error as AxiosError;
                console.log(error);
                if (axiosError.response?.status === 500) {
                    console.log('We suspect the user has no referrals');
                    dispatch(setReferralList([]));
                }
            }
        };

        const fetchTransactionList = async () => {
            try {
                let cashbackTotal = 0;
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions/user`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    }
                );

                response.data.data.forEach((transaction: { cashback?: number }) => {
                    if (transaction.cashback) {
                        cashbackTotal += transaction.cashback;
                    }
                });

                setCashbackGain(cashbackTotal);
            } catch (error) {
                console.error('Error while fetching transaction list:', error);
            }
        };

        fetchReferrals();
        fetchTransactionList();
    }, [accessToken, dispatch, referralCode]);

    return (
        <div className='relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl'>
            {/* Desktop View */}
            <main className='grow max-h-[100%] hidden lg:flex flex-col space-y-[48px]'>
                <div className='flex justify-between grow px-[6px]'>
                    <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold'>Mes Récompenses</h5>
                    <UserProfile userName={userData.name} userSurname={userData.surname} isLogoutVisible={isLogoutVisible} setIsLogoutVisible={setIsLogoutVisible}  />
                </div>

                <div className={isLogoutVisible ? `mt-[60px]` : ``}>
                    <AwardsStats referralBonus={referralBonus} filleulCount={filleulList.length} />
                </div>

                <div className='flex grow gap-[32px] overflow-auto'>
                    <FilleulList filleulList={filleulList} />
                    <div className='h-full max-w-[32%] flex flex-col gap-[20px]'>
                        <ReferralSection referralCode={referralCode!} setIsDialogVisible={setIsDialogVisible} />
                        <AwardsCashback cashbackGain={cashbackGain} />
                        <AwardsInitiateTransaction />
                    </div>
                </div>
            </main>

            {/* Mobile View */}
            <main className='lg:hidden mb-[84px] space-y-[24px] px-[6px]'>
                <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold'>Mes Récompenses</h5>
                <AwardsCashback cashbackGain={cashbackGain} />
                <AwardsStats referralBonus={referralBonus} filleulCount={filleulList.length} />
                <ReferralSection referralCode={referralCode!} setIsDialogVisible={setIsDialogVisible} />
                <FilleulList filleulList={filleulList} />
            </main>

            {/* Dialog Box */}
            {isDialogVisible && (
                <DialogBox text={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup?${queryParams}`} onClose={() => setIsDialogVisible(false)} />
            )}
        </div>
    );
};

export default AwardsBoard;