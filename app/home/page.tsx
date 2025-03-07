'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGear, faChevronDown, faUserPlus, faQrcode, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import NotificationList from '@/components/NotificationList';
import ScreenOne from '@/components/transaction_screens/ScreenOne';
import ScreenTwo from '@/components/transaction_screens/ScreenTwo';
import ScreenThree from '@/components/transaction_screens/ScreenThree';
import ScreenFour from '@/components/transaction_screens/ScreenFive';
import TransakSDK from '@/components/transaction_screens/TransakSDK';

import { useAppSelector } from '@/lib/redux/hooks';

const containerStyle = 'rounded-[12px] w-full flex-1';
const buttonStyle = `bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`;
const inputStyle = 'flex-1 w-full h-[44px] border gap-[8px] border-gray-medium py-[10px] px-[14px] rounded-[8px] text-primary_text';

interface FilleulDetails {
    order: number,
    name: string,
    commission: number,
}

const sampleFilleul: FilleulDetails = {
    order: 1,
    name: 'Gretchen Simpson',
    commission: 150
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
    const [screenIndex, setScreenIndex] = useState<number>(1)
    const [isAnimationDone, setIsAnimationDone] = useState(false)

    const userData = useAppSelector((state) => state.user)

    const sendMoneyForm = () => {
        setIsScreenVisible(true);
    }

    const moveNextScreen = () => {
        if (screenIndex < 5) {
            setScreenIndex((prev) => prev + 1);
            console.log('Moved to screen of index', screenIndex + 1)
        } else {
            setScreenIndex(1);
        }
    }

    const closeScreen = () => {
        setIsScreenVisible(false);
        setScreenIndex(1);
    }

    return (
        <div className={`relative w-full min-h-screen lg:h-[1024px] px-[8px] lg:px-[36px] flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl mx-auto bg-gray p-3`}>
            <div className={`hidden lg:flex w-[22%] flex-col justify-between bg-primary rounded-3xl p-6`}>
                <div className={`flex flex-col justify-between h-[456px]`}>
                    <h3 className={`text-white font-bold text-[30px]`}>Katika Wallet</h3>
                    <div className={`h-[220px] flex flex-col justify-between`}>
                        <div className='pannel_tab'>
                            <FontAwesomeIcon className={`icon h-[20px]`} icon={faHome} />
                            <span></span>
                            <h4>Acceuil</h4>
                        </div>
                        <div className='pannel_tab'>
                            <FontAwesomeIcon className={`h-[20px]`} icon={faCoins} />
                            <h4>Mes Transactions</h4>
                        </div>
                        <div className='pannel_tab'>
                            <FontAwesomeIcon className={`h-[20px]`} icon={faTrophy} />
                            <h4>Mes Recompenses</h4>
                        </div>
                        <div className='pannel_tab'>
                            <FontAwesomeIcon className={`h-[20px]`} icon={faGear} />
                            <h4>Parametres</h4>
                        </div>
                    </div>
                </div>
                <div className={``}>
                    <h5 className={`text-white font-light`}>Version 1.1</h5>
                </div>
            </div>
            <div className={`lg:hidden flex justify-between lg:pl-[32px] h-[59px] gap-[28px]`}>
                <div className={`size-[59px] flex justify-center items-center bg-white rounded-sm`}>
                    <FontAwesomeIcon className={`h-[32px] text-gray_dark/60`} icon={faBell} />
                </div>
                <div className={`h-full grow lg:grow-0 flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white`}>
                    <div className={`size-[41px] rounded-sm bg-gray-300`}>
                        {/* Profile Image here */}
                    </div>
                    <div className={`flex grow lg:grow-0 justify-between items-center w-[108px]`}>
                        <h5 className={`text-[16px] text-gray_dark/60 leading-[10px]`}>{`${userData.name}  ${userData.surname}`}</h5>
                        <FontAwesomeIcon className={`h-[16px] text-gray_dark/60`} icon={faChevronDown} />
                    </div>
                </div>
            </div>
            <div className={`flex flex-col w-full grow lg:w-[50%] px-[6px]`}>                
                <div className={`animate-fading-1 bg-indigo flex justify-between lg:h-[220px] rounded-[12px] ${containerStyle}`}>
                    <div className={`lg:block flex flex-col items-center flex-1 px-[24px] py-[32px]`}>
                        <h2 className={`text-white text-[16px] lg:text-[24px]`}>Welcome back, <span className={`font-bold`}>{`${userData.name}`}</span> {`${userData.surname}`}</h2>
                        <h5 className={`text-white text-[11px] lg:text-[12px]`}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</h5>
                        <button onClick={() => setIsScreenVisible(true)} className={`mt-[16px] pulse-glow lg:mt-[32px] flex justify-center text-indigo font-bold px-[18px] py-[8px] rounded-[8px] bg-white`}>Envoyer de l'argent</button>
                    </div>
                    <div className={`hidden lg:flex items-center`}>
                        <img src="/home/bulle.png" className={`h-[48px]`} alt="Image not Loaded" />
                        <img src="/home/person.png" className={`h-[205px]`} alt="Image Not Loaded" />
                    </div>
                </div>
                <div className={`animate-fading-2 flex w-full h-[204px] gap-[4%] my-[20px] lg:my-[32px]`}>
                    <div className={`bg-indigo/10 border-2 border-indigo flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-indigo h-full font-bold ${containerStyle}`}>
                        <img src='/home/cashback.png' className={` size-[24px] mb-[6px]`} />
                        <div className={`text-indigo font-bold flex items-start`}>
                            <span className={`text-[14px] lg:text-[16px]`}>XAF</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>150</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Cashback disponibles</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-indigo hover:vibrant-animation hover:animate-tingle`} >Details</button>
                    </div>
                    <div className={`bg-[#E673D5]/10 border-2 border-[#E673D5] flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-[#E673D5] font-bold w-full ${containerStyle}`}>
                        <img src='/home/parrainage.png' className={` size-[24px] mb-[6px]`} />
                        <div className={`flex items-start`}>
                            <span className={`text-[14px] lg:text-[16px] mt-2`}>XAF</span> <span className={`text-[24px] lg:text-[36px] font-extrabold`}>1.5k</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Bonus de parrainage</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-[#E673D5] hover:animate-tingle`} >Claim</button>
                    </div>
                    <div className={`bg-primary/10 border-2 border-primary flex flex-col items-center py-[16px] justify-evenly lg:justify-center text-primary font-bold ${containerStyle}`}>
                        <img src='/home/filleuls.png' className={` size-[24px] mb-[6px]`} />
                        <div>
                            <span className={`text-[24px] lg:text-[36px] font-extrabold`}>13</span>
                        </div>
                        <div className={`text-[12px] mx-[10px] text-center`}>Filleuls</div>
                        <button className={`w-[45%] mt-[8px] hidden lg:flex justify-center text-white text-[12px] px-[18px] py-[6px] rounded-[4px] bg-primary hover:animate-tingle`} >Details</button>
                    </div>
                </div>
                <div className={`animate-fading-3 bg-white rounded-[12px] flex flex-col grow py-[12px] px-[24px] space-y-[24px]`}>
                    <div className={`block lg:hidden`}>
                        {/* Parrainage */}
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
                                <button className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[36px] gap-[12px] py-[10px]`}>
                                    <FontAwesomeIcon className={`h-[20px] text-white`} icon={faUserPlus} />
                                    <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                                </button>
                                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`}>
                                    <FontAwesomeIcon className={`text-white h-[24px]`} icon={faQrcode} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <NotificationList />
                </div>
            </div>
            <div className={`w-[25%] h-full grow overflow-hidden`}>
                <div className={`hidden lg:flex h-[200px] justify-between pl-[32px] h-[59px]`}>
                    <div className={`size-[59px] flex justify-center items-center`}>
                        <FontAwesomeIcon className={`h-[32px] text-gray_dark/60`} icon={faBell} />
                    </div>
                    <div className={`h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white`}>
                        <div className={`size-[41px] rounded-sm bg-gray`}>
                            {/* Profile Image here */}
                        </div>
                        <div className={`flex justify-between items-center w-[108px]`}>
                            <h5 className={`text-[16px] text-gray_dark/60 leading-[20px]`}>{`${userData.name}  ${userData.surname}`}</h5>
                            <FontAwesomeIcon className={`h-[16px] text-gray_dark/60`} icon={faChevronDown} />
                        </div>
                    </div>
                </div>
                {/* Desktop View  Right Panel*/}
                <div className={` hidden lg:flex flex-col h-full rounded-[12px] mt-[36px] bg-white px-[24px] py-[32px]`}>
                    <div className={`hidden lg:block`}>
                        {/* Parrainage */}
                        <h4 className={`text-primary_dark mb-[16px] font-bold`}>Parrainage</h4>
                        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px]`}>
                            <h5 className={`text-[14px] text-primary font-bold mb-[8px]`}>Your Referral Code</h5>
                            <div className={`relative bg-primary/30 h-[49px] rounded-[5px] p-[10px]`}>
                                <input type='text' className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                                <button className={`absolute right-[12px] bg-primary hover:bg-primary_dark active:bg-primary_dark px-[8px] py-[6px] text-[12px] rounded-[4px] text-white font-bold`}>Copy</button>
                            </div>
                            <div className={`w-full mt-[16px] gap-[18px] flex justify-between`}>
                                <button onClick={sendMoneyForm} className={`gap-[8px] bg-primary hover:bg-primary_dark active:bg-primary_dark flex justify-between rounded-[8px] px-[20px] py-[10px]`}>
                                    <FontAwesomeIcon className={`h-[24px] text-white`} icon={faUserPlus} />
                                    <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                                </button>
                                <button className={`bg-primary hover:bg-primary_dark active:bg-primary_dark rounded-[8px] px-[20px] py-[8px]`}>
                                    <FontAwesomeIcon className={`text-white h-[24px]`} icon={faQrcode} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Filleuls */}
                    <div className={`mt-[36px] px-2 h space-y-[20px] `}>
                        <h4 className={`text-primary_dark font-bold`}>Mes Filleuls</h4>
                        <div className={`max-h-[720px] overflow-auto space-y-[20px]`}>
                         {
                                Array.from({ length: 18 }, (_, i) => {
                                    return <div key={i}><FilleulInfo details={sampleFilleul} /></div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            { isScreenVisible &&
            <div className={`fixed z-20 flex bottom-0 items-end lg:items-center justify-center w-screen h-full bg-black/40`}>
                { screenIndex==1 && <ScreenOne onClose={closeScreen} nextScreen={moveNextScreen} />}
                { screenIndex==2 && <ScreenTwo onClose={closeScreen} nextScreen={moveNextScreen} />}
                { screenIndex==3 && <ScreenThree onClose={closeScreen} nextScreen={moveNextScreen} />}
                { screenIndex==4 && <TransakSDK onClose={closeScreen} nextScreen={moveNextScreen} />}
                { screenIndex==5 && <ScreenFour onClose={closeScreen} nextScreen={moveNextScreen} />}
            </div>}
    </div>
  )
}

export default Home
