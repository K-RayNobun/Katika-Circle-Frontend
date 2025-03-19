'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGear, faChevronDown, faUserPlus, faQrcode, faBan } from '@fortawesome/free-solid-svg-icons';
import { faBell, faPaperPlane, faClock } from '@fortawesome/free-regular-svg-icons';
import React, { useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setReferralList } from '@/lib/redux/features/user/userSlice';

import axios, { AxiosError } from 'axios';

interface FilleulDetails {
    order: number,
    name: string,
    commission: number,
    bonusClaimed: boolean,
}

interface transactionDetails {
    status: string, // Differentt status types: complete, pending, failed
    date: string,
    destinatoryName: string,
    amountSent: number,
    currencySent: string,
    cashbackGain: number,
  }

const FilleulInfo = ({details}: {details: FilleulDetails}) => {
    return (
        <div className='flex justify-between items-center w-full bg-gray rounded-[6px] px-[16px] py-[12px] text-[14px] text-primary_dark'>
            <h5 className=''>{details.order}</h5>
            <div className='grow px-[20px]'>
                <h5 className='flex-4 grow-4'>{details.name}</h5>
            </div>
            <h5 className='font-bold '>XAF {details.commission}</h5>
        </div>
    )
};
 
const AwardsBoard = () => {
    const [filleulList, setFilleulList] = useState<Array<FilleulDetails>>([]);
    const [referralBonus, setReferralBonus] = useState(0);

    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.token.token);
    const referralCode = useAppSelector((state) => state.user.referralCode);
    const [cashbackGain, setCashbackGain] = useState(0);

    useEffect(() => {
        // Get the user referrals
        const fetchReferrals = async() => {
            console.log('----------------- Fecthing referrals -----------------')
            try {
                const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/referral?code=0x9999`,
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
                let filleulArray:Array<FilleulDetails> = [];
                response.data.data.forEach((referral, index) => {
                    // Get the referral and convert it into a FilleulDetails object
                    const filleul: FilleulDetails = {
                        order: index+1,
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

        const fecthTransactionList = async () => {
            try {
              let cashbackTotal = 0;
                console.log('------------------ Getting Transactions --------------')
                const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transactions/user`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                )
      
                console.log('We got this list of transactions: ', response.data.data);
                const fetchedList = response.data.data.slice().reverse();
                fetchedList.forEach((transaction, index) => {
                  const creationDate = new Date(transaction.creationDate)
                  const userTransaction: transactionDetails = {
                    status: transaction.transactionStatus,
                    date: creationDate.toLocaleString('en-US'),
                    amountSent: transaction.amount,
                    currencySent: transaction.currency.toLowerCase === 'euro' ? '€' : transaction.currency.slice(0, 3).toUpperCase() ,
                    destinatoryName: transaction.recipient.name,
                    cashbackGain: transaction.cashback,
                  }
    
                  if (transaction.cashback) {
                    cashbackTotal += transaction.cashback;
                  }
    
                //   setTransactionsList((prev) => [...prev, userTransaction]);
                  
                })
                setCashbackGain(cashbackTotal);
                console.log('----------------- Finished Getting transactions --------------');
            } catch(error) {
                console.error('We met this error  while getting the transaction list')
            }
        }

        fetchReferrals();
    }, [])

  return (
        <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            {/* Main Large view */}
            <main className='grow max-h-[100%] hidden lg:flex flex-col space-y-[48px]'>
                <div className={`flex justify-between grow px-[6px]`}>
                    <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold '>Mes Récompenses</h5>
                    <div className='hidden lg:flex justify-between pl-[32px] gap-[32px] h-[59px]'>
                        <div className='size-[59px] flex justify-center items-center'>
                            <FontAwesomeIcon className='h-[32px] text-gray_dark' icon={faBell} />
                        </div>
                        <div className='h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white'>
                            <div className='size-[41px] rounded-sm bg-gray'>
                                {/* Profile Image here */}
                            </div>
                            <div className='flex justify-between items-center w-[108px]'>
                                <h5 className='text-[16px] text-gray_dark/60'>John Doe</h5>
                                <FontAwesomeIcon className='h-[16px] text-gray_dark/60' icon={faChevronDown} />
                            </div>
                            
                        </div>
                    </div>
                </div>
                {/* Component 1: AwardsStats */}
                <div className='w-full flex gap-[32px]'>
                    <div className='flex justify-between items-center flex-1 px-[32px] rounded-[12px] border-2 bg-pink/20 border-pink min-h-[120px]'>
                        <div className='font-bold'>
                            <div className='flex items-start text-pink'>
                                <span className='text-[16px] lg:text-[16px] mt-2'>XAF</span> <span className='text-[24px] lg:text-[36px] font-extrabold'>{referralBonus.toLocaleString('en-US')}</span>
                            </div>
                            <div className='text-[16px] text-pink mx-[10px] text-center'>Bonus de parrainage</div>
                            <button className={` mt-[8px] hidden lg:flex justify-center text-white text-[16px] px-[18px] py-[10px] rounded-[4px] bg-pink`} >Reclamer le bonus</button>  
                        </div>
                        <img src="/awards/money.png" alt="" className='mt-[-12px] w-[250px]'/>
                    </div>
                    <div className='flex justify-between items-center flex-1 px-[32px] rounded-[12px] border-2 bg-primary/20 border-primary min-h-[170px]'>
                        <div className='text-primary font-bold'>
                            <div className='flex items-start'>
                                <h3 className='text-[24px] lg:text-[64px] font-extrabold'>{filleulList.length}</h3>
                            </div>
                            <div className='text-[24px] mx-[10px] text-center'>Filleuls</div>
                        </div>
                        <img src="/awards/people.png" alt="" className='mr-[100px] w-[140px]'/>
                    </div>
                </div>
                <div className='flex grow gap-[32px] overflow-auto'>
                     {/* Filleuls */} 
                    <div className='flex-1 flex flex-col h-full overflow-auto bg-white p-[16px] space-y-[20px]'>
                        {
                            filleulList.map((filleul, i) => {
                            return <div key={i}><FilleulInfo details={filleul} /></div>
                            })
                        }
                    </div>
                    <div className='h-full max-w-[32%] flex flex-col gap-[20px]'>
                        <div className='hidden lg:block overflow-hidden flex flex-col rounded-[12px] bg-white px-[16px] py-[16px]'>
                            {/* Skip this component Parrainage */}
                            <div className='hidden lg:block'>
                                <h4 className='text-primary_dark mb-[16px] font-bold'>Parrainage</h4>
                                <div className='w-full bg-primary/15 rounded-[12px] p-[16px] gap-[16px]'>
                                    <h5 className='text-[14px] text-primary font-bold mb-[8px] leading-[24px]'>Your Referral Code</h5>
                                    <div className='flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]'>
                                        <input type='text' value={referralCode} maxLength={8} className='appearance-none bg-transparent text-[14px] text-primary font-bold' style={{MozAppearance:'none'}} />
                                        <button className='w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] rounded-[4px] text-white font-bold'>Copy</button>
                                    </div>
                                    <div className='w-full mt-[16px] gap-[18px] flex justify-between'>
                                        <button className='gap-[8px] bg-primary hover:bg-primary_dark active:bg-primary_dark flex justify-between rounded-[8px] px-[20px] py-[10px]'>
                                            <FontAwesomeIcon className='h-[24px] text-white' icon={faUserPlus} />
                                            <h5 className='font-bold text-[16px] text-white'>Invite Friends</h5>
                                        </button>
                                        <button className='bg-primary hover:bg-primary_dark active:bg-primary_dark rounded-[8px] px-[20px] py-[8px]'>
                                            <FontAwesomeIcon className='text-white h-[24px]' icon={faQrcode} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Component 2:  AwardsCashbacks*/}
                        <div className='bg-indigo/20 rounded-[12px] p-[12px] gap-[8px] border-2 border-indigo flex flex-col items-center'>
                            <div className="flex items-center justify-between w-[90%]">
                                <img src='/awards/phonepay.png' className='h-[100px] mb-[6px]'/>
                                <div className="flex flex-col items-end text-indigo">
                                    <h5 className='font-bold flex items-start'><span className='text-[16px]'>XAF</span> <span className='text-[36px]'>{cashbackGain}</span></h5>
                                    <h5 className='font-bold text-[14px]'>Cashback disponibles</h5>
                                </div>
                            </div>
                            <button className='px-[18px] py-[10px] w-full bg-indigo text-white rounded-[4px]'>Convertir en Transaction</button>
                        </div>
                        {/* Component 3: AwardsInitaiteTransaction */}
                        <div className='flex flex-col bg-primary w-full rounded-[12px] gap-[0px] p-[16px]'>
                            <div className='flex'>
                                <div className='flex flex-col gap-[8px] text-white'>
                                    <h4 className='text-[16px] font-bold'>Il est temps de faire un virement</h4>
                                    <p className='text-[12px] font-light'>Pret à transférer de l'argent ? Cliquez ici pour commencer et profitez d'une experience rapide, securisée et sans tracas</p>
                                </div>
                                <img src='/awards/spacerocket.png' className=' h-[100px] mb-[6px]'/>
                            </div>
                            <button className='bg-white rounded-[4px] py-[10px] px-[18px] w-full text-primary font-bold'>Envoyer de l'argent</button>
                        </div>
                    </div>
                </div>
            </main>
            {/* Main Mobile view */}
            <main className='lg:hidden mb-[84px] space-y-[24px] px-[6px]'>
                <h5 className='text-[24px] mt-[20px] lg:mt-[40px] font-bold '>Mes Récompenses</h5>
                <div className='bg-indigo/20 rounded-[12px] p-[16px] gap-[16px] border-2 border-indigo flex flex-col items-center'>
                    <div className="flex items-center justify-between w-[90%]">
                        <img src='/awards/phonepay.png' className=' h-[100px] mb-[6px]'/>
                        <div className="flex flex-col items-end text-indigo">
                            <h5 className='font-bold flex items-start'><span className='text-[16px]'>XAF</span> <span className='text-[36px]'>150</span></h5>
                            <h5 className='font-bold text-[14px]'>Cashback disponibles</h5>
                        </div>
                    </div>
                    <button className='px-[18px] py-[10px] w-full bg-indigo text-white rounded-[4px]'>Convertir en Transaction</button>
                </div>
                <div className='w-full flex gap-[32px]'>
                    <div className='flex flex-col items-center justify-center flex-1 p-[16px] gap-[10px] rounded-[12px] border-2 bg-pink/20 border-pink font-bold'>
                        <div className='flex items-start text-pink'>
                            <span className='text-[16px] lg:text-[16px] mt-2'>XAF</span> <span className='text-[24px] lg:text-[36px] font-extrabold'>1.5k</span>
                        </div>
                        <div className='text-[12px] text-pink mx-[10px] text-center'>Bonus de parrainage</div>
                    </div>
                    <div className='flex flex-col items-center text-primary flex-1 p-[16px] rounded-[12px] border-2 bg-primary/20 border-primary '>
                        <div className='flex items-start'>
                            <h3 className='text-[24px] lg:text-[64px] font-extrabold'>13</h3>
                        </div>
                        <div className='text-[12px] mx-[10px] font-bold text-center'>Filleuls</div>
                    </div>
                </div>
                <div className='h-screen w-full flex flex-col gap-[32px]'>
                    <div className='overflow-hidden flex flex-col rounded-[12px] bg-white px-[16px] py-[16px]'>
                        <div className=''>
                            {/* Parrainage */}
                            <h4 className='text-primary_dark mb-[16px] font-bold'>Parrainage</h4>
                            <div className='w-full bg-primary/15 rounded-[12px] p-[16px] gap-[16px]'>
                                <h5 className='text-[14px] text-primary font-bold mb-[8px] leading-[24px]'>Your Referral Code</h5>
                                <div className='flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]'>
                                    <input type='text' maxLength={8} className='appearance-none bg-transparent text-[14px] text-primary font-bold' style={{MozAppearance:'none'}} />
                                    <button className='w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] rounded-[4px] text-white font-bold'>Copy</button>
                                </div>
                                <div className='w-full mt-[16px] gap-[18px] flex justify-between'>
                                    <button className='bg-primary grow flex items-center justify-center gap-[20px] rounded-[8px]'>
                                        <FontAwesomeIcon className='h-[24px] text-white' icon={faUserPlus} />
                                        <h5 className='font-bold text-[16px] text-white'>Invite Friends</h5>
                                    </button>
                                    <button className='bg-primary hover:bg-primary_dark active:bg-primary_dark rounded-[8px] px-[20px] py-[8px]'>
                                        <FontAwesomeIcon className='text-white h-[24px]' icon={faQrcode} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Filleuls */}
                        <div className='grow py-[16px] rounded-[12px] gap-[12px] bg-white overflow-auto space-y-[20px] '>
                            <h4 className='mt-[16px] text-primary_dark text-[16px] font-bold'>Mes Filleuls</h4>
                            <div className='grow overflow-auto space-y-[20px]'>
                                { filleulList.length > 0 ?  
                                    <div>
                                        {
                                            filleulList.map((filleul, i) => {
                                                return <div key={i}><FilleulInfo details={filleul} /></div>
                                            })
                                        }
                                    </div>
                                : <div className={`flex justify-center items-center w-full h-[80px] text-primary font-semibold bg-gray rounded-[12px]`}>
                                        <h5 className={`text-[14px] text-gray_dark`}>You have no filleuls yet</h5> 
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
    </div>
  )
}

export default AwardsBoard