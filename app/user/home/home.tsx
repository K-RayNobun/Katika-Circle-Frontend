'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUserPlus, faQrcode, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useState } from 'react';
import NotificationList from '@/components/NotificationList';
import ScreenOne from '@/components/transaction_screens/ScreenOne';
import ScreenTwo from '@/components/transaction_screens/ScreenTwo';
import ScreenThree from '@/components/transaction_screens/ScreenThree';
import ScreenFour from '@/components/transaction_screens/ScreenFour';
import TransakSDK from '@/components/transaction_screens/TransakSDK';
import DialogBox from '@/components/DialogBox';
import Image from 'next/image';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setReferralList, resetUser } from '@/lib/redux/features/user/userSlice';
import { resetToken } from '@/lib/redux/features/token/tokenSlice';
import { resetTransaction } from '@/lib/redux/features/transaction/transactionSlice';
import axios, { AxiosError } from 'axios';

import { useRouter } from 'next/navigation';

const containerStyle = 'rounded-[12px] w-full flex-1';

interface FilleulDetails {
    order: number,
    name: string,
    commission: number,
    bonusClaimed: boolean,
}

const FilleulInfo = ({ details }: { details: FilleulDetails }) => {
    return (
        <div className={`flex justify-between items-center w-full bg-gray rounded-[6px] px-[16px] py-[12px] text-[14px] text-primary_dark`}>
            <h5 className={``}>{details.order}</h5>
            <div className={`grow px-[20px]`}>
                <h5 className={`flex-4 grow-4`}>{details.name}</h5>
            </div>
            <h5 className={`font-bold `}>XAF {details.commission}</h5>
        </div>
    )
};



const Home = () => {

    const [isScreenVisible, setIsScreenVisible] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [screenIndex, setScreenIndex] = useState<number>(1)
    const [filleulList, setFilleulList] = useState<FilleulDetails[]>([]);
    const [referralBonus, setReferralBonus] = useState<number>(0);

    const userData = useAppSelector((state) => state.user);
    const accessToken = useAppSelector((state) => state.token.token);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const referralCodeParam = {
        ref_code: userData.referralCode?.toString() || '',
    };
    const queryParams = new URLSearchParams(referralCodeParam).toString();

    const logoutUser = () => {
        dispatch(resetUser());
        dispatch(resetToken());
        dispatch(resetTransaction());
        router.push('/auth/signin');
    }

    const moveNextScreen = () => {
        if (screenIndex < 5) {
            setScreenIndex((prev) => prev + 1);
            console.log('Moved to screen of index', screenIndex + 1)
        } else {
            setScreenIndex(1);
        }
    }

    useEffect(() => {
        // Get the user referrals
        const fetchReferrals = async() => {
            console.log('----------------- Fecthing referrals -----------------');
            console.log('User Referral Code', userData.referralCode);
            console.log('Its Access Token is: ', accessToken);
            try {
                const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/referral?code=${userData.referralCode}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                )
                console.log('Referral list is:', response.data.data);
                dispatch(setReferralList(response.data.data));
                let referralGainTotal = 0;
                const filleulArray:Array<FilleulDetails> = [];
                response.data.data.forEach((referral:any, index:number) => {
                    // Get the referral and convert it into a FilleulDetails object
                    const filleul: FilleulDetails = {
                        order: index,
                        name: `${referral.fname} ${referral.lname}`,
                        commission: referral.referral.bonusTotal,
                        bonusClaimed: referral.referral.bonusStatus === 'UNCLAIMED' ? false : true,
                    };

                    if(filleulList.length !== 0) {
                        filleulList.forEach((filleulRegistered) => {
                            if (filleulRegistered.order === filleul.order) {
                                console.log('Filleul already exist');
                            } else {
                                filleulArray.push(filleul);
                                console.log('Added the filleul: ', filleul.name);
                            }
                        })
                    } else if (filleulList.length === 0){
                        filleulArray.push(filleul);
                    }
                    console.log('The FILLEUL List is set !!!');

                    if(referral.referral.bonusStatus === 'UNCLAIMED') {
                        referralGainTotal += referral.referral.bonusTotal;
                    }
                });
                setFilleulList(filleulArray);
                setReferralBonus(referralGainTotal);
                console.log('------------- Finished fecthing referrals -----------------')
            } catch(error) {
                const axiosError = error as AxiosError
                console.log(error);
                if (axiosError.response?.status === 500) {
                    console.log('--------------- Error of type 500 ---------------');
                    console.log('We suspect the user has no referrals');  
                    dispatch(setReferralList([]))
                }
            }
        };

        fetchReferrals();
    }, [accessToken, dispatch, filleulList, userData.referralCode]);

    const closeScreen = () => {
        setIsScreenVisible(false);
        setScreenIndex(1);
    }

    return (
        <div className={`h-full mb-[64px] lg:mb-0 grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            <div className={`flex flex-col w-full grow mt-[80px] lg:mt-[0px] lg:w-[50%] px-[6px]`}>                
                {/* Component 1:The welcome container */}
                <div className={`animate-fading-1 bg-indigo flex justify-between lg:h-[200px] rounded-[12px] ${containerStyle}`}>
                    <div className={`lg:block flex flex-col items-center px-[24px] py-[32px]`}>
                        <h2 className={`text-white text-[16px] lg:text-[24px]`}>Welcome back, <span className={`font-bold`}>{`${userData.name}`}</span> {`${userData.surname}`}</h2>
                        <h5 className={`text-white text-[11px] lg:text-[12px]`}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</h5>
                        <button onClick={() => setIsScreenVisible(true)} className={`mt-[16px] pulse-glow lg:mt-[32px] flex justify-center text-indigo font-bold px-[18px] py-[8px] rounded-[8px] bg-white`}>Envoyer de l&apos;argent</button>
                    </div>
                    <div className={`hidden lg:flex items-center`}>
                        <Image src="/home/bulle.png" className={`h-[48px]`} alt="Image not Loaded" />
                        <Image src="/home/person.png" className={`h-[205px]`} alt="Image Not Loaded" />
                    </div>
                </div>
                {/* Component 2 containing three container boxes */}
                <div className={`animate-fading-2 flex w-full h-[204px] gap-[4%] my-[20px] lg:my-[32px]`}>
                    <div className={`bg-indigo/10 border-2 border-indigo flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-indigo h-full font-bold ${containerStyle}`}>
                        <Image src='/home/cashback.png' className={` size-[24px] mb-[6px]`} alt="Cashback" />
                        <div className={`text-indigo font-bold flex items-start`}>
                            <span className={`text-[14px] lg:text-[16px]`}>XAF</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{userData.cashback}</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Cashback disponibles</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-indigo hover:vibrant-animation hover:animate-tingle`} >Details</button>
                    </div>
                    <div className={`bg-[#E673D5]/10 border-2 border-[#E673D5] flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-[#E673D5] font-bold w-full ${containerStyle}`}>
                        <Image src='/home/parrainage.png' className={` size-[24px] mb-[6px]`} alt="Parrainage" />
                        <div className={`flex items-start`}>
                            <span className={`text-[14px] lg:text-[16px] mt-2`}>XAF</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{referralBonus.toLocaleString('en-US')}</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Bonus de parrainage</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-[#E673D5] focus:animate-tingle scale-110 duration-300`} >Claim</button>
                    </div>
                    <div className={`bg-primary/10 border-2 border-primary flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-primary font-bold ${containerStyle}`}>
                        <Image src='/home/filleuls.png' className={` size-[24px] mb-[6px]`} alt="Filleuls" />
                        <div>
                            <span className={`text-[24px] lg:text-[36px] font-extrabold`}>{filleulList.length}</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Filleuls</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-primary hover:animate-tingle`} >Details</button>
                    </div>
                </div>
                <div className={`animate-fading-3 bg-white rounded-[12px] flex flex-col grow py-[12px] px-[24px] space-y-[24px]`}>
                    {/* Component 3: Parrainage section box */}
                    <div className={`block lg:hidden`}>
                        <div className={`flex justify-between items-end mb-[16px] font-bold`}>
                            <h4 className={`text-primary_dark text-[16px]`}>Parrainage</h4>
                            <h4 className={`text-primary text-[12px]`}>Voir les filleuls</h4>
                        </div>
                        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px] flex flex-col gap-[16px]`}>
                            <h5 className={`text-[14px] text-primary`}>Your Referral Code</h5>
                            <div className={`flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]`}>
                                <input type='text' className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                                <button className={`w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] rounded-[4px] text-white font-bold`}>Copy</button>
                            </div>
                            <div className={`w-full gap-[18px] flex justify-between`}>
                                <button onClick={() => setIsDialogVisible(true)} className={`gap-[8px] grow bg-red flex justify-center rounded-[8px] px-[36px] gap-[12px] py-[10px]`}>
                                    <FontAwesomeIcon className={`h-[20px] text-white`} icon={faUserPlus} />
                                    <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                                </button>
                                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`}>
                                    <FontAwesomeIcon className={`text-white h-[24px]`} icon={faQrcode} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <NotificationList accessToken={accessToken!} rate={667} />
                </div>
            </div>
            <div className={`w-[25%] max-h-[900px] h-full grow`}>
                {/* Component 4: The user profile section */}
                <div className={`absolute top-[12px] lg:relative flex w-full justify-between px-[20px] lg:pl-[32px] lg:pr-[0px] h-[59px]`}>
                    <div className={`size-[59px] flex bg-white justify-center items-center`}>
                        <FontAwesomeIcon className={`h-[38px] lg:h-[32px] text-gray_dark/60`} icon={faBell} />
                    </div>
                    <div className={`relative h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white`}>
                        <div className={`size-[41px] rounded-sm bg-gray`}>
                            {/* Profile Image here */}
                        </div>
                        <button onClick={() => setIsLogoutVisible((prev) => !prev)} className={`flex justify-between items-center text-gray_dark/60 hover:text-primary_dark w-[164px]`}>
                            <h5 className={`text-[16px] leading-[20px] font-semibold`}>{`${userData.name}  ${userData.surname}`}</h5>
                            <FontAwesomeIcon className={`h-[16px] transition-all duration-400`} icon={ !isLogoutVisible ? faChevronDown : faChevronUp} />
                        </button>
                        {/* Create a logout button that appears with isLogoutVisible */}
                        { isLogoutVisible && <div className={`absolute top-[10%] transition-all duration-1000 translate-y-[60px] right-[0] bg-white rounded-[12px] w-[70%] px-[16px] py-[8px]`}>
                            <button onClick={logoutUser} className={`w-full py-[6px] text-primary_dark font-semibold active:scale-110`}>Logout</button>
                        </div>}
                    </div>
                </div>
                {/* Desktop View  Right Panel*/}
                <div className={`${ isLogoutVisible ? 'mt-[78px]' : 'mt-[36px]' } hidden grow lg:flex flex-col justify-between h-full rounded-[12px] bg-white px-[24px] py-[32px] transition-all duration-500`}>
                    <div className={`hidden lg:block`}>
                    {/* Component 3 in Desktop View: Parrainage section box */}
                    <h4 className={`text-primary_dark mb-[16px] font-bold`}>Parrainage</h4>
                        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px]`}>
                            <h5 className={`text-[14px] text-primary font-bold mb-[8px]`}>Your Referral Code</h5>
                            <div className={`relative bg-primary/30 h-[49px] rounded-[5px] p-[10px]`}>
                                <input type='text' readOnly={true} value={userData.referralCode} className={`appearance-none bg-transparent text-[16px] font-semibold text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                                <button className={`absolute right-[12px] top-[50%] translate-y-[-50%] bg-primary hover:bg-primary_dark active:bg-primary_dark px-[8px] py-[6px] text-[12px] rounded-[4px] text-white font-bold`}>Copied</button>
                            </div>
                            <div className={`w-full mt-[16px] gap-[18px] flex justify-between`}>
                                <button onClick={() => setIsDialogVisible(true)} className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[36px] gap-[12px] py-[10px]`}>
                                    <FontAwesomeIcon className={`h-[20px] text-white`} icon={faUserPlus} />
                                    <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                                </button>
                                <button className={`bg-primary hover:bg-primary_dark active:bg-primary_dark rounded-[8px] px-[20px] py-[8px]`}>
                                    <FontAwesomeIcon className={`text-white h-[24px]`} icon={faQrcode} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Component 5 : Filleuls section (Appears only in deskltop view)*/}
                    <div className={`mt-[36px] px-2 py-[16px] space-y-[20px]`}>
                        <h4 className={`text-primary_dark font-bold`}>Mes Filleuls</h4>
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
                                    <h5 className={`text-[14px] text-gray_dark`}>You have no filleuls yet</h5> 
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
            {
                isDialogVisible && !isScreenVisible &&
                <DialogBox text={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup?${queryParams}`} onClose={() => setIsDialogVisible(false)} />
            }
            { isScreenVisible &&
                <div className={`fixed top-0 left-0 right-0 z-20 flex bottom-0 items-end lg:items-center justify-center w-screen h-full bg-black/40`}>
                    { screenIndex==1 && <ScreenOne onClose={closeScreen} nextScreen={moveNextScreen} />}
                    { screenIndex==2 && <ScreenTwo onClose={closeScreen} nextScreen={moveNextScreen} />}
                    { screenIndex==3 && <ScreenThree onClose={closeScreen} nextScreen={moveNextScreen} />}
                    { screenIndex==4 && <TransakSDK onClose={closeScreen} nextScreen={moveNextScreen} />}
                    { screenIndex==5 && <ScreenFour onClose={closeScreen} nextScreen={moveNextScreen} />}
                </div>
            }
        </div>
    )
}

export default Home
