'use client'

import React, {useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';

import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { PiLockKey, PiSmiley } from "react-icons/pi";
import { RiExchangeLine, RiHandCoinLine, RiHeadphoneLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";
import { useAppSelector } from '@/lib/redux/hooks';

const LandingNavbar = () => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(1);
  return (
    <nav className='fixed top-0 left-0 z-50 blur-4 bg-transparent h-16 w-[100vw] flex items-center justify-between px-[7.5%]'>
      <Image src='/landing/SendLogo.svg' height={40} width={75} alt='Send' className='' />
      <div className='display flex items-center gap-[32px]'>
        <Link onClick={() => setActiveTabIndex(1)} href='#' className={activeTabIndex === 1 ? 'font-semibold text-pink_fluo' : 'text-white'}>Acceuil</Link>
        <Link onClick={() => setActiveTabIndex(2)} href='#' className={activeTabIndex === 2 ? 'font-semibold text-pink_fluo' : 'text-white'}>Blog</Link>
        <Link onClick={() => setActiveTabIndex(3)} href='#' className={activeTabIndex === 3 ? 'font-semibold text-pink_fluo' : 'text-white'}>Contact</Link>
      </div>
      <button className='bg-pink_fluo text-white rounded-[12px] px-[16px] py-[12px]'>Envoyer de l'argent</button>
    </nav> 
  )
}

const HeroSection = () => {
  return (
    <section className='relative w-screen h-screen pl-[7.5%] pt-[3%] bg-gradient-to-tr from-[#0ff3] via-[#320754] to-[#f0f3] flex justify-center items-center'>
      <div className='w-full z-20 min-h-[482px] opacity-100 flex items-center justify-between gap-[32px]'>
        <div className='w-[50%] pr-[6%] text-white space-y-[32px]'>
          <h1 className='great text-[56px] font-extrabold leading-[64px]'>Ils sont loin, mais leur <span className='text-green_fluo'>bonheur</span> est proche.</h1>
          <p className='text-[14px]'>Avec <span className='font-semibold'>Send</span>, 
            <span className='font-semibold text-blue_fluo'> envoyez de l'argent</span> en Afrique, 
            <span className='font-semibold text-green_fluo'> instantanément</span> et en toute confiance 
          </p>
          <div className='w-full flex gap-[16px]'>
            <button className='bg-pink_fluo text-white font-semibold rounded-[12px] py-[12px] w-full'>Envoyer de l'argent</button>
            <button className='bg-white text-primary font-semibold rounded-[12px] py-[12px] w-full'>Comment ca fonctionne</button>
          </div>
          <div className='flex items-center justify-center gap-[20px]'>
            <div className='bg-blue-800/30 flex-1 rounded-[20px] h-[144px]'></div>
            <div className= 'bg-blue-800/30 flex-1 rounded-[20px] h-[144px]'></div>
            <div className='bg-blue-800/30 flex-1 rounded-[20px] h-[144px]'></div>
          </div>
        </div>
          <div className='w-[50%] relative pr-[3%] h-full flex justify-center items-end'>
          <Image width={10} height={10} src={'/landing/AnnaMsg.svg'} alt='Image Not loaded' className='absolute top-[25%] left-0 w-[300px] translate-x-[-25%]' />
          <Image width={10} height={10} src={'/landing/CherieMsg.svg'} alt='Image Not loaded' className='absolute top-[70%] right-0 translate-x-[-25%] w-[300px]' />
          <Image width={10} height={10} src={'/landing/ManInThought.svg'} alt='Image Not loaded' className='w-[464px] h-[638px]' />
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-[url("/landing/GridOctogonal.svg")] bg-no-repeat bg-cover bg-center opacity-5 flex items-center justify-center'>
      </div>
    </section>
  )
};

const SimulatorSection = ({accessToken}: {accessToken: string}) => {
  const [katikaRates, setKatikaRates] = useState<Array<number>>([]);
  const [cashbackPercentage, setCashbackPercentage] = useState(0);
  const katikaRateRef = useRef(0);
  const amountSentRef = useRef(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const rateIndex = useRef(0);

  const updateRate = async() => {
    // console.log('The amount considered is ', amountSentRef.current);
    if (amountSentRef.current >= 30 && amountSentRef.current < 50) {
        rateIndex.current = 0;
    } else if (amountSentRef.current >= 50 && amountSentRef.current < 100) {
        rateIndex.current = 1;
    } else if (amountSentRef.current >= 100 && amountSentRef.current < 250) {
        rateIndex.current = 2;
    } else if (amountSentRef.current >= 250 && amountSentRef.current < 500) {
        rateIndex.current = 3;
    } else if (amountSentRef.current >= 500 && amountSentRef.current < 2000) {
        rateIndex.current = 4;
    } else if (amountSentRef.current >= 2000 && amountSentRef.current <= 70000) {
        rateIndex.current = 5;
    }
    // console.log('Rates index is', rateIndex.current);
    // console.log('Updated the rate to ', katikaRates[rateIndex.current]);
    katikaRateRef.current = katikaRates[rateIndex.current];
  }

  const fetchRate = async () => {
    // console.log('Access Token is', accessToken);
    // console.log('Calculating the rate');
    try {
        // Rate from €/XAF
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/rate/xaf`,
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        const ratesData = response.data.data.toCurrency[0].rates;
        // console.log('Rates Data is', ratesData);
        const ratesArray = [ratesData.firstRate, ratesData.secondRate, ratesData.thirdRate, ratesData.fourthRate, ratesData.fifthRate, ratesData.sixthRate]            
        setKatikaRates(ratesArray);
        setCashbackPercentage(response.data.data.toCurrency[0].cashbackRate);
        // console.log('Set the rates as ', ratesArray);
        katikaRateRef.current = ratesArray[0];
    } catch(error) {
        const axiosError = error as AxiosError;
        console.log('Sorry, we couldn;t get the rate due to the error ', axiosError)
        if(axiosError.message === 'Network Error') {
            console.log('Network error');
        }
    }
  }

  // handleamountSentChange set the input value to amountSentRef and updates the rate
  const handleAmountSentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(inputValue) && inputValue !== '') {
        return;
    }

    const value = parseFloat(inputValue);
    amountSentRef.current = isNaN(value) ? 0 : value;
    updateRate();
    setAmountReceived(amountSentRef.current * katikaRateRef.current);
}

  useEffect(() => {
    fetchRate();
  }, []);

  return (
    <section className='w-full min-h-[720px] bg-purple-950 px-[7.5%] py-[7%] flex justify-center items-center'>
      <div className='flex items-center justify-between'>
        <div className='bg-white min-w-[600px] flex flex-col gap-[20px] items-center justify-center rounded-[20px] p-[22px]'>
          <div className='w-full border-2 border-gray_dark/30 bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[20px]'>
            <h4 className='font-semibold text-primary'>You send</h4>
            <div className='flex items-center justify-between text-[32px] font-bold'>
              <input type="number" min="0" step="0.01" onChange={handleAmountSentChange}
                     placeholder={'0'} className='w-[300px] bg-transparent px-1 rounded-md'
                     onKeyDown={(e) => {
                      // Prevent input of unwanted characters
                      if (!/[\d.]/.test(e.key) && 
                          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                          e.preventDefault();
                      }
                  }} />
              <div className='flex justify-center items-center gap-4'> 
                <h1>EUR</h1>
                <Image width={10} height={10} src={'/landing/France.svg'} alt='Image Not loaded' className='w-[50px] h-[39px]' />
                <FaChevronDown size={24} className='text-[32px]' />
              </div>
            </div>
          </div>
          <div className='w-full border-2 border-gray_dark/30 bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[20px]'>
            <h4 className='font-semibold text-primary'>They receive</h4>
            <div className='flex items-center justify-between text-[32px] font-bold'>
              <input type="number" readOnly={true} value={amountReceived} className='w-[300px] bg-transparent px-1 rounded-md' />
              <div className='flex justify-center items-center gap-4'> 
                <h1>XAF</h1>
                <Image width={10} height={10} src={'/landing/Cameroon.svg'} alt='Image Not loaded' className='w-[50px] h-[39px]' />
                <FaChevronDown size={24} className='' />
              </div>
            </div>
          </div>
          <div className='w-full bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[12px]'>
            
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>Exchange rate</h4>
              <h4>1 € = {katikaRateRef.current} CFA</h4>
            </div>
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>Transfer fees</h4>
              <h4>0.0 €</h4>
            </div>
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>Cashback generated</h4>
              <h4>{cashbackPercentage * amountSentRef.current} €</h4>
            </div>
          </div>
        </div>
        <div className='w-[45%] pl-[6%] float-end text-white'>
          <h1 className='great text-[56px] font-bold leading-[74px] mb-4'>Lorem ipsum <span className='text-gold_fluo'>dolor</span> sit amet.</h1>
          <p>Vous envoyez pour l'école; la santé; l'amour , les projets, nous on vous aide à le faire vite, bien et sans frais cachés.</p>
        </div>
      </div>
    </section>
  );
};

const SliderSection = () => {
  return (
    <section className='w-full min-h-[660px] bg-purple-800 px-[7.5%] py-[7%] flex justify-center items-center'>
      <div className='flex items-center justify-between'>
        <div className='w-[30%] text-white'>
          <h1 className='great text-[56px] font-bold leading-[74px] mb-4'>Pourquoi <span className='text-pink_fluo'>envoyer</span> de l'argent ?</h1>
          <p>Vous envoyez pour l'école; la santé; l'amour , les projets, nous on vous aide à le faire vite, bien et sans frais cachés.</p>
        </div>
        <div className='bg-purple-700 min-w-[600px] h-[300px] flex items-center justify-between rounded-[20px] p-[40px]'>
          <FaRegArrowAltCircleLeft className='text-white text-[56px] cursor-pointer' />
          <FaRegArrowAltCircleRight className='text-white text-[56px] cursor-pointer' />
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className='w-full min-h-[660px] bg-purple-950 px-[7.5%] py-[7%] flex justify-center items-center'>
      <div className='w-full rounded-[44px] bg-purple-900 px-[5%] py-[36px] flex items-center justify-between'>
        <div  className='w-[50%] flex flex-col gap-[14px] items-end'>
          <div className='flex flex-col gap-[12px] items-end'>
            <div className='rounded-[8px] bg-purple-600 p-[8px] flex justify-center items-center'>
              <PiLockKey className='text-white font-bold text-[32px]' />
            </div>
            <h4 className='text-white'>Sécurité</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-end'>
            <div className='rounded-[8px] bg-purple-600 p-[8px] flex justify-center items-center'>
              <RiExchangeLine className='text-white font-bold text-[32px]' />
            </div>
            <h4 className='text-white'>Taux de change avantageux</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-end'>
            <div className='rounded-[8px] bg-purple-600 p-[8px] flex justify-center items-center'>
              <RiHandCoinLine className='text-white font-bold text-[32px]' />
            </div>
            <h4 className='text-white'>Reception Instantanée</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-end'>
            <div className='rounded-[8px] bg-purple-600 p-[8px] flex justify-center items-center'>
              <RiHeadphoneLine className='text-white font-bold text-[32px]' />
            </div>
            <h4 className='text-white'>Support humain et multilingue</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-end'>
            <div className='rounded-[8px] bg-purple-600 p-[8px] flex justify-center items-center'>
              <PiSmiley className='text-white font-bold text-[32px]' />
            </div>
            <h4 className='text-white'>Assistance à la fois en Europe et en Afrique</h4>
          </div>
        </div>
        <div className='w-[32%] text-white'>
          <h1 className='great text-[56px] font-bold leading-[74px] mb-4'>Pourquoi <span className='text-blue_fluo'>nous choisir</span></h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
    </section>
  );
};

const DestinationSection = () => {
  return (
    <section className='flex flex-col items-center justify-center w-full min-h-[660px] bg-purple-950 px-[7.5%] py-[7%]'>
      <h1 className='great text-[56px] text-white bg-purple-950 leading-[74px] mb-6'>Les destinations <span className='text-green_fluo'>disponibles</span></h1>
      <div className='relative w-full h-[720px] flex items-center justify-center'>
        <Image width={10} height={10} src={'/landing/WorldMap.svg'} alt='Image Not loaded' className='w-[100%] h-full' />
        <div className='absolute z-10'>
          <div className='flex justify-center items-start translate-y-[-40px] translate-x-[70px]'>
            {/* Display image of MapPointer and CameroonBrand here */}
            <Image width={10} height={10} src={'/landing/MapPointer.svg'} alt='Image Not loaded' className='w-[50px] h-[68px]' />
            <Image width={10} height={10} src={'/landing/CameroonBrand.svg'} alt='Image Not loaded' className='w-[141px]' />
          </div>
        </div>
      </div>
    </section>
  );
}

const HomePage = () => {

  const accessToken = useAppSelector((state) => state.token.token);

return (
    <div className='h-screen bg-[#320754] w-screen pb-24'>
      <LandingNavbar />
      <HeroSection />
      <SimulatorSection accessToken={accessToken!} />
      <SliderSection />
      <FeaturesSection />
      <DestinationSection />
    </div>
  )
}

export default HomePage;