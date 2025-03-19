import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ProfileSection = () => {
    return (
        <div className='w-full h-full py-[12px] px-[18px] space-y-[16px] lg:space-y-[26px]'>
            <h4 className='text-[24px] hidden lg:block font-bold text-primary'>Profil</h4>
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-semibold text-[20px]'>Informations personnelles</h5>
                    <button className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary text-primary hover:text-white hover:bg-primary'>
                        <h5 className='font-bold'>Edit</h5>
                        <FontAwesomeIcon icon={faPen} size='sm' />
                    </button>
                </div>
                <div className='lg:grid grid-cols-2 lg:gap-[32px] gap-[16px] flex flex-col text-[16px] font-semibold pr-[30%]'>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Nom</h5>
                        <h5>Doe</h5>
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Prenom</h5>
                        <h5>John</h5>
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Email</h5>
                        <h5>johndoe@gmail.com</h5>
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Phone</h5>
                        <h5>+33 36 452 29</h5>
                    </div>
                </div>
                <button className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary text-primary hover:text-white hover:bg-primary'>
                    <h5 className='font-bold text-primary'>Edit</h5>
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </button>
            </div>
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-semibold text-[20px]'>Mot de passe</h5>
                    <button className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary text-primary hover:text-white hover:bg-primary'>
                        <h5 className='font-bold'>Edit</h5>
                        <FontAwesomeIcon icon={faPen} size='sm' />
                    </button>
                </div>
                <div className='space-y-[8px] text-[16px] font-semibold'>
                    <h5 className='text-gray_dark/50'>Mot de passe</h5>
                    <div className='flex rounded-[8px] gap-[8px] border-2 border-gray_dark/50 text-gray_dark/50 px-[16px] py-[8px]'>
                        <input type='text' defaultValue='****************' className='text-gray_dark/50 font-bold' />
                    </div>
                </div>
                <button className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary text-primary hover:text-white hover:bg-primary'>
                    <h5 className='font-bold text-primary'>Edit</h5>
                    <FontAwesomeIcon icon={faPen} size='sm' className='text-primary' />
                </button>
            </div>
        </div>
    );
};

export default ProfileSection;