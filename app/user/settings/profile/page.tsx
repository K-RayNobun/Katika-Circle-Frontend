'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoins, faTrophy, faGear, faChevronDown, faUserPlus, faQrcode, faBan, faPen } from '@fortawesome/free-solid-svg-icons';
import { faBell, faPaperPlane, faClock } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core';

const ProfileBoard = () => {

  return (
    <div className={`relative h-full grow flex flex-col lg:flex-row gap-[24px] rounded-lg sm:rounded-3xl`}>
            {/* Main Large view */}
            <main className='grow flex flex-col mb-[84px] lg:space-y-[48px]'>
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
                                <h5 className='text-[16px] text-gray_dark/60'>John Doe</h5>
                                <FontAwesomeIcon className='h-[16px] text-gray_dark/60' icon={faChevronDown} />
                            </div>
                            
                        </div>
                    </div>
                </div>
                <section className='flex flex-col lg:flex-row flex-1 bg-white rounded-[12px]'>
                    <div className=' flex lg:flex-col h-[64px] border-r border-r-gray px-[24px] py-[8px] space-x-[6px] lg:space-y-[24px]'>
                        <div className='grow flex items-center justify-center h-full px-[16px] py-[10px] rounded-[8px] bg-primary/20 text-primary font-bold'><h5>Profil</h5></div>
                        <div className='grow flex items-center justify-center h-full px-[16px] py-[10px] rounded-[8px] hover:bg-primary/10 hover:text-primary hover:font-bold'><h5>Notifications</h5></div>
                        <div className='grow flex items-center justify-center h-full px-[16px] py-[10px] rounded-[8px] hover:bg-primary/10 hover:text-primary hover:font-bold'><h5>Aide et FAQ</h5></div>
                    </div>
                    <div className='w-full py-[12px] px-[18px] space-y-[16px] lg:space-y-[26px]'>
                        <h4 className='text-[24px] hidden lg:block font-bold text-primary'>Profil</h4>
                        <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                            <div className='flex justify-between'>
                                <h5 className='font-bold text-[20px]'>Informations personnelles</h5>
                                <button className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'><h5 className='font-bold text-primary'>Edit</h5> <FontAwesomeIcon icon={faPen} size='sm' className='text-primary' /></button>
                            </div>
                            <div className='lg:grid grid-cols-2 lg:gap-[32px] gap-[16px] flex flex-col text-[16px] font-bold pr-[30%]'>
                                <div className='space-y-[8px]'><h5 className='text-gray_dark/50'>Nom</h5> <h5>{'Doe'}</h5></div>
                                <div className='space-y-[8px]'><h5 className='text-gray_dark/50'>Prenom</h5> <h5>{'John'}</h5></div>
                                <div className='space-y-[8px]'><h5 className='text-gray_dark/50'>Email</h5> <h5>{'johndoe@gmail.com'}</h5></div>
                                <div className='space-y-[8px]'><h5 className='text-gray_dark/50'>Phone</h5> <h5>{'+33 36 452 29'}</h5></div>
                            </div>
                            <button className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'><h5 className='font-bold text-primary'>Edit</h5> <FontAwesomeIcon icon={faPen} size='sm' className='text-primary' /></button>
                        </div>
                        <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                            <div className='flex justify-between'>
                                <h5 className='font-bold text-[20px]'>Mot de passe</h5>
                                <button className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'><h5 className='font-bold text-primary'>Edit</h5> <FontAwesomeIcon icon={faPen} size='sm' className='text-primary' /></button>
                            </div>
                            <div className='space-y-[8px] text-[16px] font-bold'>
                                <h5 className='text-gray_dark/50'>Mot de passe</h5>
                                <div className='flex rounded-[8px] gap-[8px] border-2 border-gray_dark/50 text-gray_dark/50 px-[16px] py-[8px]'>
                                    <input type='text' defaultValue='****************' className='text-gray_dark/50 font-bold'/>
                                </div>
                            </div>
                            <button className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'><h5 className='font-bold text-primary'>Edit</h5> <FontAwesomeIcon icon={faPen} size='sm' className='text-primary' /></button>
                        </div>
                    </div>
                </section>
            </main>
            {/* Main Mobile view */}
    </div>
  )
}

export default ProfileBoard