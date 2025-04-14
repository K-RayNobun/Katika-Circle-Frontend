'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setReferralList } from '@/lib/redux/features/user/userSlice';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import WelcomeContainer from '@/components/pagesComponents/WelcomeContainer';
import StatsContainer from '@/components/pagesComponents/StatsContainer';
import ReferralSection from '@/components/pagesComponents/ReferralSection';
import NotificationList from '@/components/NotificationList';
import UserProfile from '@/components/pagesComponents/UserProfile';
import FilleulList from '@/components/pagesComponents/FilleulList';
import ReferralDialogBox from '@/components/ReferralDialogBox';
import TransactionScreens from '@/components/pagesComponents/TransactionScreens';
import { resetTransaction, provideTransakReturnedData } from '@/lib/redux/features/transaction/transactionSlice';

interface FilleulDetails {
    order: number;
    name: string;
    commission: number;
    bonusClaimed: boolean;
}

const Home = () => {
    // State Management
    const [isScreenVisible, setIsScreenVisible] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [screenIndex, setScreenIndex] = useState<number>(1);
    const [filleulList, setFilleulList] = useState<FilleulDetails[]>([]);
    const [referralBonus, setReferralBonus] = useState<number>(0);
    const [state, stateUpdate] = useState('fr');
    const router = useRouter();

    const userData = useAppSelector((state) => state.user);
    const transactionDetails = useAppSelector((state) => state.transaction);
    const accessToken = useAppSelector((state) => state.token.token);
    const dispatch = useAppDispatch();
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    useEffect(() => {
        console.log('Returned Home Page with Characteristics...');
        const orderId = urlParams.get('orderId');
        const status = urlParams.get('status');
        const totalFeeInFiat = urlParams.get('totalFeeInFiat');

        const postTransaction = async () => {
            try {
                console.log(`Posting transaction with of amount : ${transactionDetails.amountSent} ${transactionDetails.currencySent}`);
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction`,
                    {
                        amount: transactionDetails.amountSent,
                        currency: transactionDetails.currencySent === '€' ? 'EURO' : 'USD',
                        transactionType: transactionDetails.transfertType,
                        recipient:
                            transactionDetails.transfertType === 'MobileMoney'
                                ? {
                                      name: transactionDetails.receiverName,
                                      amountReceive: transactionDetails.amountReceived,
                                      phone: transactionDetails.receiverPhoneNumber,
                                      receiverCountry: transactionDetails.receiverCountry,
                                  }
                                : {
                                      name: transactionDetails.receiverName,
                                      amountReceive: transactionDetails.amountReceived,
                                      iban: transactionDetails.iban,
                                      bankCode: transactionDetails.bankCode,
                                      bankName: transactionDetails.bankName,
                                      receiverCountry: transactionDetails.receiverCountry,
                                  },
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    }
                );
                console.log('Transaction posted successfully:', response.data);
                console.log('------------------ Finished Posting Transaction -----------------');
            } catch (error) {
                console.error('Error posting transaction:', error);
            }
        };

        if (orderId || status || totalFeeInFiat) {
            console.log(`---> Identified parameters: orderId=${orderId}, status=${status}`);
            postTransaction(); // Call postTransaction before dispatching
            dispatch(
                provideTransakReturnedData({
                    transakOrderId: orderId || '',
                    transakOrderStatus: status || '',
                    transakOrderFeesInFiat: totalFeeInFiat || '',
                })
            );
            dispatch(resetTransaction());
            setIsScreenVisible(false);
            router.push('/user/home'); // Remove the additionnal status data
        }
        // State update
        console.log(state);
    }, [urlParams]);

    // Referral Code Query Params
    const referralCodeParam = {
        ref_code: userData.referralCode?.toString() || '',
    };
    const queryParams = new URLSearchParams(referralCodeParam).toString();

    // Handlers
    const moveToScreen = (index: number) => {
        console.log('Just triggered Screen moving');
        if (index === 1) {
            if (screenIndex < 5) {
                setScreenIndex((prev) => prev + 1);
                console.log('Moved to next screen :>', screenIndex + 1);
            } else {
                setScreenIndex(1);
            }
        } else if (index === -1) {
            if (screenIndex > 1) {
                setScreenIndex((prev) => prev - 1);
                console.log('Moved to previous screen :>', screenIndex - 1);
            } else {
                setScreenIndex(1);
            }
        } else {
            console.log('The index passed instead is', index);
        }
    };

    const closeScreen = () => {
        setIsScreenVisible(false);
        setScreenIndex(1);
        dispatch(resetTransaction());
    };

    // Fetch Referrals
    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                console.log('Fetching referrals with access token:', accessToken);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/referral?code=${userData.referralCode}`,
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

                response.data.data.forEach((referral: { fname: string; lname: string; referral: { bonusTotal: number; bonusStatus: string } }, index: number) => {
                    const filleul: FilleulDetails = {
                        order: index,
                        name: `${referral.fname} ${referral.lname}`,
                        commission: referral.referral.bonusTotal,
                        bonusClaimed: referral.referral.bonusStatus === 'UNCLAIMED' ? false : true,
                    };

                    if (!filleulArray.some((f) => f.order === filleul.order)) {
                        filleulArray.push(filleul);
                    } else {
                        console.log('Duplicate entry found: ', filleul.name);
                    }

                    if (referral.referral.bonusStatus === 'UNCLAIMED') {
                        referralGainTotal += referral.referral.bonusTotal;
                    }
                });

                setFilleulList(filleulArray);
                setReferralBonus(referralGainTotal);
                console.log('Finished fetching referrals');
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 500) {
                    console.log('We suspect the user has no referrals');
                    dispatch(setReferralList([]));
                }
            }
        };

        fetchReferrals();
    }, []);

    return (
        <div className={`h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            {/* Left Panel */}
            <div className={`flex flex-col w-full grow mt-[80px] lg:mt-[0px] lg:w-[50%] px-[6px]`}>
                <WelcomeContainer userData={userData} setIsScreenVisible={setIsScreenVisible} />
                <StatsContainer userData={{ cashback: userData.cashback! }} referralBonus={referralBonus} filleulList={filleulList} />
                <div className={`animate-fading-3 bg-white rounded-[12px] flex flex-col grow py-[12px] px-[24px] space-y-[24px]`}>
                    {/* Mobile View: Referral Section */}
                    <div className={`block lg:hidden`}>
                        <div className={`flex justify-between items-end mb-[16px] font-bold`}>
                            <h4 className={`text-primary_dark text-[16px]`}>Parrainage</h4>
                            <h4 className={`text-primary text-[12px]`}>Voir les filleuls</h4>
                        </div>
                        <ReferralSection referralCode={userData.referralCode!} isScreenVisible={isScreenVisible} />
                    </div>
                    <NotificationList accessToken={accessToken!} rate={667} />
                </div>
            </div>

            {/* Right Panel */}
            <div className={`w-[25%] max-h-[900px] h-full grow`}>
                <UserProfile
                    userName={userData.name}
                    userSurname={userData.surname}
                    isMobileDisplayed={true}
                    stateUpdate={stateUpdate}
                />
                {/* Desktop View: Referral Section and Filleul List */}
                <div className={`mt-[100px] hidden grow lg:flex flex-col gap-[36px] justify-between h-[100%] rounded-[12px] bg-white px-[24px] py-[32px] transition-all duration-500`}>
                    <ReferralSection referralCode={userData.referralCode!} isScreenVisible={isScreenVisible} />
                    <FilleulList filleulList={filleulList} />
                </div>
            </div>

            {/* Dialog Box */}
            {isDialogVisible && !isScreenVisible && (
                <ReferralDialogBox text={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup?${queryParams}`} onClose={() => setIsDialogVisible(false)} />
            )}

            {/* Transaction Screens */}
            {isScreenVisible && (
                <TransactionScreens screenIndex={screenIndex} closeScreen={closeScreen} moveToScreen={moveToScreen} />
            )}
        </div>
    );
};

export default Home;