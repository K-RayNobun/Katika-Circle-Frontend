'use client'

import React, {useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';

import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { PiLockKey, PiSmiley } from "react-icons/pi";
import { RiExchangeLine, RiHandCoinLine, RiHeadphoneLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useOneTimeAnimation } from '@/lib/hooks/useOneTimeAnimation';
import { GiMoneyStack } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi2";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { IconType } from 'react-icons/lib';

import Footer from '@/components/pagesComponents/Footer';

const LandingNavbar = ({t, navigateTo}:{t: (path: string) => string, navigateTo: (path: string) => void}) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='z-10 bg-black/20 h-16 w-[100vw]'>
      <div className='absolute w-full h-full -z-20 '></div>
      <div className='relative flex items-center z-30 justify-between px-[7.5%] h-full w-full'>
        <Image src='/landing/SendLogo.svg' height={40} width={75} alt='Send' className='' />
        
        {/* Mobile Menu Button */}
        <button 
          className='md:hidden text-white'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-[32px]'>
          <Link onClick={() => setActiveTabIndex(1)} href='#' className={activeTabIndex === 1 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.home')}
          </Link>
          <Link onClick={() => setActiveTabIndex(2)} href='#' className={activeTabIndex === 2 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.blog')}
          </Link>
          <Link onClick={() => setActiveTabIndex(3)} href='#' className={activeTabIndex === 3 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.contact')}
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden absolute top-16 left-0 right-0 flex-col items-center bg-black/90 py-4`}>
          <Link onClick={() => { setActiveTabIndex(1); setIsMenuOpen(false); }} href='#' className={`py-2 ${activeTabIndex === 1 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
            {t('landing.navbar.home')}
          </Link>
          <Link onClick={() => { setActiveTabIndex(2); setIsMenuOpen(false); }} href='#' className={`py-2 ${activeTabIndex === 2 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
            {t('landing.navbar.blog')}
          </Link>
          <Link onClick={() => { setActiveTabIndex(3); setIsMenuOpen(false); }} href='#' className={`py-2 ${activeTabIndex === 3 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
            {t('landing.navbar.contact')}
          </Link>
        </div>

        <button onClick={() => navigateTo('/user/home')} className='hidden md:block bg-pink_fluo text-white rounded-[12px] px-[16px] py-[12px]'>
          {t('landing.hero.buttons.sendMoney')}
        </button>

      </div>
    </nav> 
  )
}

const HeroSection = ({t, navigateTo}:{t: (path: string) => string, navigateTo: (path: string) => void}) => {

  const Card = ({ icon: Icon, title, description }: { icon: IconType, title: string, description: string }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const handleClick = () => {
      setIsFlipped(prev => !prev);
    };

    useEffect(() => {
        // Add a timeout that unflip the card after 5 seconds
        if (isFlipped) {
          timeoutRef.current = setTimeout(() => {
            setIsFlipped(false);
          }, 5000);
        }
        
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        };

    }, [isFlipped])
    
  
    return (
      <div className='card bg-blue-800/30 rounded-[20px] w-full md:min-w-[180px] h-[160px] perspective'>
        <div 
          className={`card-inner relative w-full h-full transform transition-transform duration-500 ${isFlipped ? 'flipped' : ''}`}
          onClick={handleClick}
        >
          <div className="card-front absolute w-full h-full bg-blue-800/30 rounded-[20px] flex flex-col justify-center items-center gap-2 text-white p-4">
            <Icon className='text-white size-10' />
            <h4 className="text-lg font-bold text-center">{title}</h4>
          </div>
          <div className="card-back absolute w-full h-full text-blue-900 bg-white rounded-[20px] flex flex-col justify-center items-center p-4">
            <p className="text-[12px] text-center">{description}</p>
          </div>
        </div>
      </div>
    );
  };

  const sectionRef = useOneTimeAnimation();

  return (
    <section ref={sectionRef} className='relative w-screen min-h-screen border-t-4 border-white px-[4%] lg:pr-0 lg:pl-[7.5%] py-[6%] bg-blue_dark bg-gradient-to-tr from-[#0ff3] via-[#320754] via-20% to-[#f0f3] to-90% flex justify-center items-center'>
      <div className='w-full z-20 min-h-[402px] h-full opacity-100 flex flex-col md:flex-row items-center justify-between gap-[32px]'>
        <div className='w-full lg:w-[50%] slide-in-left pr-0 md:pr-[2%] text-white space-y-[24px] md:space-y-[48px]'>
          <h1 className='great text-center lg:text-start text-4xl lg:text-4xl lg:leading-[64px]'>
            {t('landing.hero.title')} <span className='text-green_fluo'>{t('landing.hero.titleHighlight')}</span> {t('landing.hero.titleEnd')}
          </h1>
          <p className='text-[16px] text-center lg:text-start'>
            {t('landing.hero.subtitle.prefix')} <span className='font-semibold'>{t('landing.hero.subtitle.brand')}</span>, 
            <span className='font-semibold text-blue_fluo'> {t('landing.hero.subtitle.action')}</span> {t('landing.hero.subtitle.destination')}, 
            <span className='font-semibold text-green_fluo'> {t('landing.hero.subtitle.highlight')}</span> {t('landing.hero.subtitle.suffix')}
          </p>
          <div className='w-full flex justify-evenly lg:px-[8px] gap-2 lg:gap-4'>
            <button onClick={() => navigateTo('/user/home')} className='bg-pink_fluo text-white font-semibold rounded-[12px] py-[8px] lg:py-[12px] w-full duration-300 hover:scale-105 lg:hover:scale-110'>
              {t('landing.hero.buttons.sendMoney')}
            </button>
            <button onClick={() => navigateTo('/user/home')} className='bg-white text-[14px]  text-primary font-semibold rounded-[12px] py-[16px] w-full duration-300 hover:scale-105'>
              {t('landing.hero.buttons.howItWorks')}
            </button>
          </div>
          <div className='card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-[20px]'>
            <Card 
              icon={GiMoneyStack}
              title={t('landing.hero.cards.cashback.title')}
              description={t('landing.hero.cards.cashback.description')}
            />
            <Card 
              icon={HiUserGroup}
              title={t('landing.hero.cards.referral.title')}
              description={t('landing.hero.cards.referral.description')}
            />
            <Card 
              icon={MdOutlineSupportAgent}
              title={t('landing.hero.cards.support.title')}
              description={t('landing.hero.cards.support.description')}
            />
          </div>
        </div>
        <div className='max-w-[370px] md:max-w-[100%] md:w-[50%] ml-[36px] slide-in-right relative pr-0 md:pr-[3%] h-full flex justify-center items-end md:mt-0'>
          <Image width={10} height={10} src={'/landing/AnnaMsg.svg'} alt='Image Not loaded' className='absolute top-[40%] left-0 w-[250px] md:w-[300px] translate-x-[-25%]' />
          <Image width={10} height={10} src={'/landing/CherieMsg.svg'} alt='Image Not loaded' className='absolute top-[70%] right-0 translate-x-[20%] md:translate-x-[-25%] w-[250px] md:w-[300px]' />
          <Image width={10} height={10} src={'/landing/ManInThought.svg'} alt='Image Not loaded' className='w-[464px] md:h-[580px]' />
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full z-0 h-full bg-[url("/landing/GridOctogonal.svg")] bg-no-repeat bg-cover bg-center opacity-[3%] flex items-center justify-center'>
      </div>
    </section>
  )
};

const SimulatorSection = ({t}: {t: (path: string) => string}) => {

  const [katikaRates, setKatikaRates] = useState<Array<number>>([]);
  const [cashbackPercentage, setCashbackPercentage] = useState(0);
  const katikaRateRef = useRef(0);
  const amountSentRef = useRef(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const rateIndex = useRef(0);
  
  const sectionRef = useOneTimeAnimation();

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/rates`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        const ratesData = response.data.data[0].toCurrency[0].rates;
        const ratesArray = [ratesData.firstRate, ratesData.secondRate, ratesData.thirdRate, ratesData.fourthRate, ratesData.fifthRate, ratesData.sixthRate]            
        setKatikaRates(ratesArray);
        setCashbackPercentage(response.data.data[0].toCurrency[0].cashbackRate);
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
    <section ref={sectionRef} className='w-full min-h-[660px] bg-[#551A82] md:px-[5%] py-[7%] flex justify-center items-center overflow-x-hidden'>
      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-0 w-full max-w-[1200px]'>
        <div className='w-full md:grow lg:w-[50%] lg:min-w-[600px] slide-in-right flex flex-col gap-[20px] items-center justify-center rounded-[20px] p-4 md:p-[22px]'>
          <div className='w-[100%] border-2 border-gray_dark/30 bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[20px]'>
            <h4 className='font-semibold text-primary'>{t('landing.simulator.form.send.label')}</h4>
            <div className='flex items-center justify-between text-[32px] md:text-[44px] font-bold'>
              <input type="number" min="0" step="0.01" onChange={handleAmountSentChange}
                     placeholder={'0'} className='w-[240px] lg:w-[300px] bg-transparent px-1 rounded-md'
                     onKeyDown={(e) => {
                      // Prevent input of unwanted characters
                      if (!/[\d.]/.test(e.key) && 
                          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                          e.preventDefault();
                      }
                  }} />
              <div className='flex justify-center items-center gap-2 md:gap-4'> 
                <h1 className='text-[28px] lg:text-[44px]'>€</h1>
                <Image width={10} height={10} src={'/landing/euro.png'} alt='Image Not loaded' className='w-[40px] md:w-[50px] h-[39px]' />
                <FaChevronDown size={24} className='w-[18px] md:w-[24px]' />
              </div>
            </div>
          </div>
          <div className='w-full border-2 border-gray_dark/30 bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[20px]'>
            <h4 className='font-semibold text-primary'>{t('landing.simulator.form.receive.label')}</h4>
            <div className='flex items-center justify-between text-[32px] md:text-[40px] font-bold'>
              <input type="number" readOnly={true} value={amountReceived} 
                    className='w-[220px] lg:w-[300px] bg-transparent px-1 rounded-md' />
              <div className='flex justify-center items-center gap-1 md:gap-4'> 
                <h1 className='text-[28px] lg:text-[44px]'>XAF</h1>
                <Image width={10} height={10} src={'/landing/Cameroon.svg'} alt='Image Not loaded' className='w-[40px] md:w-[50px] h-[39px]' />
                <FaChevronDown size={24} className='w-[18px] md:w-[24px]' />
              </div>
            </div>
          </div>
          <div className='w-full bg-gray rounded-[20px] px-[16px] py-[12px] flex flex-col gap-[12px]'>
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>{t('landing.simulator.form.details.exchangeRate')}</h4>
              <h4>1 € = {katikaRateRef.current} CFA</h4>
            </div>
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>{t('landing.simulator.form.details.transferFees')}</h4>
              <h4>0.0 €</h4>
            </div>
            <div className='flex items-center justify-between text-[18px] text-gray_dark/60 font-bold'>
              <h4>{t('landing.simulator.form.details.cashbackGenerated')}</h4>
              <h4>{cashbackPercentage * amountSentRef.current} €</h4>
            </div>
          </div>
        </div>
        <div className='w-full md:w-[45%] px-4 md:pl-[4%] text-center md:text-left slide-in-left text-white'>
          <h1 className='great text-[14px] md:text-[56px] font-bold leading-tight md:leading-[74px] mb-4'>{t('landing.simulator.title')} <span className='text-gold_fluo'>{t('landing.simulator.titleHighlight')} </span>{t('landing.simulator.titleEnd')}</h1>
          <p className='text-[14px]'>{t('landing.simulator.description')}</p>
        </div>
      </div>
    </section>
  );
};

const SliderSection = ({t}:{t: (path: string) => string}) => {
 
  const sectionRef = useOneTimeAnimation();

  return (
    <section ref={sectionRef} className='w-full min-h-[660px] bg-[#320754] md:bg-[#551A82] px-4 md:px-[7.5%] py-[7%] flex justify-center items-center'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0'>
        <div className='w-full lg:w-[30%] slide-in-left text-white text-center md:text-left'>
          <h1 className='great text-[56px] font-bold leading-[74px] mb-4'>
            {t('landing.slider.title')} <span className='text-pink_fluo'>{t('landing.slider.titleHighlight')}</span> {t('landing.slider.titleEnd')}
          </h1>
          <p>{t('landing.slider.description')}</p>
        </div>
        <div className='bg-purple-800 w-full max-w-[450px] md:max-w-[800px] lg:min-w-[600px] lg:w-[50%] slide-in-right h-[300px] flex items-center justify-between rounded-[20px] p-[20px] md:p-[40px]'>
          <FaRegArrowAltCircleLeft className='text-white text-[56px] cursor-pointer' />
          <FaRegArrowAltCircleRight className='text-white text-[56px] cursor-pointer' />
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = ({t}:{t: (path: string) => string}) => {

  const sectionRef = useOneTimeAnimation();

  return (
    <section ref={sectionRef} className='w-full min-h-[660px] bg-purple-900 lg:bg-blue_dark px-4 md:px-[7.5%] py-[7%] flex justify-center items-center'>
      <div className='w-full rounded-[44px] lg:bg-purple-900 px-4 md:px-[5%] py-[36px] flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-0'>
        <div className='w-[70%] md:w-[50%] slide-in-left flex flex-col gap-[14px] items-center lg:items-end text-center'>
          <div className='flex feature-box flex-col gap-[12px] items-center lg:items-end'>
            <div className='feature-box'>
              <div className=' rounded-[8px] purple-glowing p-[8px] flex justify-center items-center'>
                <PiLockKey className='text-white font-bold text-[32px]' />
              </div>
            </div>
            <h4 className='text-white'>{t('landing.features.items.security')}</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-center lg:items-end'>
            <div className='feature-box'>
              <div className='rounded-[8px] purple-glowing p-[8px] flex justify-center items-center'>
                <RiExchangeLine className='text-white font-bold text-[32px]' />
              </div>
            </div>
            <h4 className='text-white'>{t('landing.features.items.rates')}</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-center lg:items-end'>
            <div className='feature-box'>
              <div className='rounded-[8px] purple-glowing p-[8px] flex justify-center items-center'>
                <RiHandCoinLine className='text-white font-bold text-[32px]' />
              </div>
            </div>
            <h4 className='text-white'>{t('landing.features.items.instant')}</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-center lg:items-end'>
            <div className='feature-box'>
              <div className='rounded-[8px] purple-glowing p-[8px] flex justify-center items-center'>
                <RiHeadphoneLine className='text-white font-bold text-[32px]' />
              </div>
            </div>
            <h4 className='text-white'>{t('landing.features.items.support')}</h4>
          </div>
          <div className='flex flex-col gap-[12px] items-center lg:items-end'>
            <div className='feature-box'>
              <div className='rounded-[8px] purple-glowing p-[8px] flex justify-center items-center'>
                <PiSmiley className='text-white font-bold text-[32px]' />
              </div>
            </div>
            <h4 className='text-white'>{t('landing.features.items.assistance')}</h4>
          </div>
        </div>
        <div className='w-full md:w-[32%] slide-in-right text-white text-center md:text-left'>
          <h1 className='great text-[56px] font-bold leading-[74px] mb-4'>{t('landing.features.title')} <span className='text-blue_fluo'>{t('landing.features.titleHighlight')}</span></h1>
          <p>{t('landing.features.description')}</p>
        </div>
      </div>
    </section>
  );
};

const DestinationSection = ({t}:{t: (path: string) => string}) => {

  const sectionRef = useOneTimeAnimation();

  return (
    <section ref={sectionRef} className='flex flex-col items-center justify-center w-full min-h-[660px] bg-blue_dark px-4 md:px-[7.5%] py-[5%]'>
      <h1 className='great text-3xl md:text-[56px] slide-in-up text-white leading-tight md:leading-[74px] mb-6 text-center'>{t('landing.destinations.title')} <span className='text-green_fluo'>{t('landing.destinations.titleHighlight')}</span></h1>
      <div className='relative w-full slide-in-up delay-100 h-[320px] md:h-[720px] flex items-center justify-center'>
        <Image width={10} height={10} src={'/landing/WorldMap.svg'} alt='Image Not loaded' className='w-[100%] h-full' />
        <div className='absolute z-10'>
          <div className='flex justify-center items-start translate-y-[-40px] translate-x-[70px]'>
            {/* Display image of MapPointer and CameroonBrand here */}
            <Image width={10} height={10} src={'/landing/MapPointer.svg'} alt='Image Not loaded' className='w-[50px] h-[68px]' />
            <Image width={10} height={10} src={'/landing/CameroonBrand.svg'} alt={t('landing.destinations.countries.cameroon')} className='w-[141px]' />
          </div>
        </div>
      </div>
    </section>
  );
}

const HomePage: React.FC = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

return (
    <main id='landing' className='relative h-screen bg-[#320754] w-screen pb-24'>
      <LandingNavbar t={t} navigateTo={navigateTo} />
      <HeroSection t={t} navigateTo={navigateTo} />
      <SimulatorSection t={t} />
      <SliderSection t={t} />
      <FeaturesSection t={t} />
      <DestinationSection t={t} />
      <Footer />
    </main>
  )
}

export default HomePage;