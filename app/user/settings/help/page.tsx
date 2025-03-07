'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGear, faChevronDown, faUserPlus, faQrcode, faBan, faPen, faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { faBell, faPaperPlane, faClock } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core';
 
const HelpFAQBoard = () => {

    const [toogledIndex, setToogledIndex] = useState<number|null>(null);

    const FAQData = [
        {
            title: "Combien de temps prend un transfert d'argent avec un wallet décentralisé ?",
        },
        {
            title: "Quels sont les moyens de confirmer ma transaction ?",
        },
        {
            title: "Quels moyens de paiement acceptez-vous ?",
        },
        {
            title: "Puis-je payer en plusieurs fois ?",
        },
        {
            title: "Comment obtenir une facture pour ma transaction ?",
        },
        {
            title: "Puis-je modifier ou annuler ma transaction ?",
        },
    ];

    const handleToogle = (index: number) => {
        if (toogledIndex == null) {
            setToogledIndex(index)
            console.log('Displayed the FAQ No.', index+1);
        } else if (toogledIndex == index) {
            setToogledIndex(null);
            console.log('SHowed again the element No.', index+1)
        } else if (toogledIndex !== index){
            setToogledIndex(index);
            console.log('Displayed the element No.', index+1);
        } else {
            console.log('You got an unexpected case');
        }
    }
  return (
        <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            {/* Main Large view */}
            <main className='grow flex flex-col mb-[84px] lg:space-y-[16px]'>
                <div className={`flex justify-between px-[6px]`}>
                    <h5 className='text-[24px] my-[20px] lg:mt-[40px] font-bold '>Parametres</h5>
                    <div className='hidden lg:flex justify-between pl-[32px] gap-[32px] h-[59px]'>
                        <div className='size-[59px] flex justify-center items-center'>
                            <FontAwesomeIcon className='h-[32px] text-gray_dark' icon={faBell} />
                        </div>
                        <div className='h-full flex items-center rounded-[8px] gap-[16px] px-[24px] py-[9px] bg-white'>
                            <div className='size-[41px] rounded-sm bg-gray'>
                                {/* Profile Image here */}
                            </div>
                            <div className='flex justify-between items-center w-[108px]'>
                                <h5 className='text-[16px] text-gray_dark'>John Doe</h5>
                                <FontAwesomeIcon className='h-[16px] text-gray_dark' icon={faChevronDown} />
                            </div>
                            
                        </div>
                    </div>
                </div>
                <section className='flex flex-col lg:flex-row flex-1 bg-white rounded-[12px]'>
                    <div className='h-full border-r-2 border-r-gray px-[12px] py-[8px]'>
                        <div className='flex lg:flex-col text-center lg:justify-start w-full lg:w-[160px] h-[64px] lg:h-max space-x-[6px] lg:space-y-[24px]'>
                            <div className='grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] hover:bg-primary/10 hover:text-primary hover:font-bold w-full'><h5>Profil</h5></div>
                            <div className='grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] hover:bg-primary/10 hover:text-primary hover:font-bold w-full'><h5>Notifications</h5></div>
                            <div className='grow flex items-center justify-center lg:justify-start h-full w-full px-[16px] py-[10px] rounded-[8px] bg-primary/20 text-primary font-bold w-full'><h5>Aide et FAQ</h5></div>
                        </div>
                    </div>
                    <div className='w-full p-[16px] lg:p-[32px] lg:space-y-[64px]'>
                        <h4 className='text-[24px] hidden lg:block font-bold text-primary'>Aide et FAQ</h4>
                        <div className=''>
                           {
                            FAQData.map((faq, index) => (
                                <div className={`py-[18px] pl-[12px] pr-[64px] lg:w-[920px] relative ${index == FAQData.length - 1 ? "":"border-b-2 border-gray"}  ${ toogledIndex == index ? '':'hover:bg-gray hover:border-b-[2px]' }border-gray`}>
                                    <h5 className='font-bold text-[16px] lg:text-[18px] mb-[6px]'>{faq.title}</h5>
                                    <p id={`content-${index}`} className={`text-[14px] lg:text-[16px] transition duration-700 ease-in-out ${index == toogledIndex ? 'block' : 'hidden'}`}> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis labore reprehenderit neque cupiditate natus animi ea error ut rem nemo placeat assumenda quas, aliquid, dolor omnis. Soluta reiciendis nihil libero exercitationem laborum alias, asperiores quaerat velit aliquid quae iusto vitae eum ut magnam temporibus odio quibusdam debitis. Unde error nemo eum pariatur? Excepturi architecto molestiae illum commodi consequuntur doloribus dolorem?</p>
                                    <button className='transition duration-700 ease-in-out' onClick={() => {handleToogle(index)}}>
                                        <FontAwesomeIcon size='xl' icon={ toogledIndex == index ? faCircleMinus : faCirclePlus} className='
                                        
                                        hover:transform hover:scale-125 ease-in-out text-primary absolute top-[12px] right-[24px]'/>
                                    </button>
                                </div>
                            ))
                           }
                        </div>
                    </div>
                </section>
            </main>
            {/* Main Mobile view */}
    </div>
  )
}

export default HelpFAQBoard