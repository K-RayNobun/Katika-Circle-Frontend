'use client';

import React, { useState, useRef, useMemo } from 'react';
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { LiaTimesSolid, LiaCheckSolid } from "react-icons/lia";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import OTPModal from '@/components/pagesComponents/OTPModal';
import NewPasswordModal from '@/components/pagesComponents/NewPasswordModal';


import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';
import axios, { AxiosError } from 'axios';
import { useTranslation } from '@/lib/hooks/useTranslation';
import AsyncSpinner from '../AsyncSpinner';

const ProfileSettings = () => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingCredentials, setIsEditingCredentials] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);

    const userData = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [name, setName] = useState(userData.name || '');
    const [surname, setSurname] = useState(userData.surname || '');
    const [email, setEmail] = useState(userData.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
    const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validatedCredentials = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const validateEmail = useMemo(() => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    }, [email]);

    const validatePassword = useMemo(() => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{6,}$/;
        return passwordRegex.test(currentPassword);
    }, [currentPassword]);

    const testCredentials = async () => {
        try {
            // ENSURE THE EMAIL THE USER WANTS TO MODIFY IS THE ONE REGISTERED
            if (email !== userData.email) {
                return;
            }
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/login`,
                { email: userData.email, pwd: currentPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Login successful: ', response);
            dispatch(
                renewToken({
                    token: response.data.data['access-token'],
                    expiresIn: 5 * 60 * 1000,
                })
            );
            validatedCredentials.current = true;
            // console.log(t('settingsProfile.otpVerified'));
        } catch (error) {
            console.log(`----------- Catched error: ${error} -----------`);
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 500) {
                setError(t('settingsProfile.errorTestingCredentials'));
            }
            validatedCredentials.current = false;
        }
    };

    const handleNameSave = () => {
        setIsEditingName(false);
        // console.log(t('settingsProfile.personalInfo'), name, surname);
    };

    const handleCredentialsSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        if (validateEmail || validatePassword) {
            try {
                await testCredentials();
                if (validatedCredentials.current) {
                    setShowOTPModal(true);
                }
            } catch {
                setError(t('settingsProfile.invalidCredentials'));
            } finally {
                setIsSubmitting(false)
            }
        } else {
            console.log(' Email or password are not corrects')
            setError(t('settingsProfile.invalidCredentials'));
        }
        setIsSubmitting(false);
    };

    return (
        <div className='w-full py-[12px] px-[18px] space-y-[16px] lg:space-y-[26px]'>
            <h4 className='text-[24px] hidden lg:block font-bold text-primary'>{t('settingsProfile.profile')}</h4>

            {/* Name and Surname Section */}
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-bold text-[18px]'>{t('settingsProfile.personalInfo')}</h5>
                    {isEditingName ? (
                        <div className='flex gap-[8px]'>
                            <button
                                onClick={handleNameSave}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                            >
                                <LiaCheckSolid size={20} className='text-primary' />
                            </button>
                            <button
                                onClick={() => setIsEditingName(false)}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-red'
                            >
                                <LiaTimesSolid size={20} className='text-red' />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingName(true)}
                            className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                        >
                            <h5 className='font-bold text-primary'>{t('settingsProfile.edit')}</h5>
                            <PiPencilSimpleLineDuotone size={20} className='text-primary' />
                        </button>
                    )}
                </div>
                <div className='lg:grid grid-cols-2 lg:gap-[32px] gap-[16px] flex flex-col text-[14px] font-bold pr-[30%]'>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>{t('settingsProfile.firstName')}</h5>
                        {isEditingName ? (
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                            />
                        ) : (
                            <h5>{name}</h5>
                        )}
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>{t('settingsProfile.lastName')}</h5>
                        {isEditingName ? (
                            <input
                                type='text'
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                            />
                        ) : (
                            <h5>{surname}</h5>
                        )}
                    </div>
                </div>
            </div>

            {/* Email and Password Section */}
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-bold text-[18px]'>{t('settingsProfile.emailPassword')}</h5>
                    {!isEditingCredentials && (
                        <button
                            onClick={() => setIsEditingCredentials(true)}
                            className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                        >
                            <h5 className='font-bold text-primary'>{t('settingsProfile.edit')}</h5>
                            <PiPencilSimpleLineDuotone size={20} className='text-primary' />
                        </button>
                    )}
                </div>
                <div className='space-y-[16px]'>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>{t('settingsProfile.email')}</h5>
                        {isEditingCredentials ? (
                            <div className="relative w-full bg-gray">
                                <input
                                    type='email'
                                    readOnly={userData.email ? true : false}
                                    value={userData.email ? email : ''}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full p-[8px] bg-white border-2 border-gray rounded-[8px]'
                                />
                                
                            </div>
                        ) : (
                            <h5>{email}</h5>
                        )}
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>{t('settingsProfile.password')}</h5>
                        {isEditingCredentials ? (
                            <div className="relative w-full">
                                <input
                                    type={ isCurrentPasswordHidden ? 'password' : 'text'}
                                    placeholder={t('settingsProfile.currentPassword')}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                                />
                                {/* Eye logo */}
                                {   
                                    isCurrentPasswordHidden ?
                                    <LuEyeClosed
                                        size={20}
                                        className='absolute top-[50%] right-[10px] translate-y-[-50%] cursor-pointer'
                                        onClick={() => setIsCurrentPasswordHidden(!isCurrentPasswordHidden)}
                                    />
                                    :
                                    <LuEye
                                        size={20}
                                        className='absolute top-[50%] right-[10px] translate-y-[-50%] cursor-pointer'
                                        onClick={() => setIsCurrentPasswordHidden(!isCurrentPasswordHidden)}
                                    />
                                }
                            </div>
                        ) : (
                            <h5>********</h5>
                        )}
                    </div>
                </div>
                {error && (
                    <div className='text-red text-center font-semibold text-sm mb-2'>
                        {error}
                    </div>
                )}
                {isEditingCredentials && (
                    <button
                        onClick={handleCredentialsSubmit}
                        className={`w-full bg-primary text-white px-[16px] py-[8px] rounded-[8px] ${isSubmitting ? 'opacity-50' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <AsyncSpinner />
                        ) : (
                            <h6 className='text-center font-bold'>{t('settingsProfile.submit')}</h6>
                        )}
                    </button>
                )}
            </div>
            
            {/* New PAssword & New Password Confirm Modal */}
            {showNewPasswordModal && (
                <NewPasswordModal
                    onClose={() => {
                        setShowNewPasswordModal(false);
                        setError(null);
                    }}
                    setShowNewPasswordModal={setShowNewPasswordModal}
                />
            )}

            {/* OTP Modal */}
            {showOTPModal && (
                <OTPModal
                    onClose={() => {
                        setShowOTPModal(false);
                        setShowNewPasswordModal(true);
                    }}
                />
            )}
        </div>
    );
};

export default ProfileSettings;