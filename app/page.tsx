'use client'

import React, { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';

import HomeSections from '@/components/landingPages/HomeSections';
import FaqSection from '@/components/landingPages/FAQSection';
import Footer from '@/components/pagesComponents/Footer';

const LandingNavbar = ({t, switchTabIndex, navigateTo}:{t: (path: string) => string, switchTabIndex: (index: number) => void, navigateTo: (path: string) => void}) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabSelection = (index: number) => {
    setActiveTabIndex(index);
    switchTabIndex(index);
    setIsMenuOpen(false);
  }

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
          <Link onClick={() => handleTabSelection(1)} href='#' className={activeTabIndex === 1 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.home')}
          </Link>
          <Link onClick={() => handleTabSelection(2)} href='#' className={activeTabIndex === 2 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.blog')}
          </Link>
          <Link href='#' className={activeTabIndex === 3 ? 'font-semibold text-pink_fluo' : 'text-white'}>
            {t('landing.navbar.contact')}
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden absolute top-16 left-0 right-0 flex-col items-center bg-black/90 py-4`}>
          <Link onClick={() => { handleTabSelection(1) }} href='#' className={`py-2 ${activeTabIndex === 1 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
            {t('landing.navbar.home')}
          </Link>
          <Link onClick={() => { handleTabSelection(2) }} href='#' className={`py-2 ${activeTabIndex === 2 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
            {t('landing.navbar.blog')}
          </Link>
          <Link href='#' className={`py-2 ${activeTabIndex === 3 ? 'font-semibold text-pink_fluo' : 'text-white'}`}>
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


const HomePage: React.FC = () => {

  const { t } = useTranslation();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(1);

  const switchTabIndex = (index: number) => {
    console.log('The Index changed is : ', index);
    setTabIndex(index)
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  const page: {'index':number, 'component':ReactNode}[] = [
    {
      'index': 1,
      'component': <HomeSections />
    },
    {
      'index': 2,
      'component': <FaqSection />
    }
  ]

return (
    <main id='landing' className='relative h-screen bg-[#320754] w-screen pb-24'>
      <LandingNavbar t={t} switchTabIndex={switchTabIndex} navigateTo={navigateTo} />
      {
        page[tabIndex-1].component
      }
      <Footer />
    </main>
  )
}

export default HomePage;