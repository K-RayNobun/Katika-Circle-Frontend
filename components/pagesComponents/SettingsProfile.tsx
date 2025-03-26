'use client';

import React, { useState } from 'react';
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { LiaTimesSolid, LiaCheckSolid } from "react-icons/lia";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import OTPModal from '@/components/pagesComponents/OTPModal'; // Import the OTP modal component

import UserProfile from './UserProfile';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { provideId } from '@/lib/redux/features/user/userSlice';
import axios, { AxiosError } from 'axios';

const ProfileSettings = () => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);

    const [name, setName] = useState('John');
    const [surname, setSurname] = useState('Doe');
    const [email, setEmail] = useState('johndoe@gmail.com');
    const [password, setPassword] = useState('********');
    const [currentPassword, setCurrentPassword] = useState('');

    const userData = useAppSelector((state) => state.user);
    const accessToken = useAppSelector((state) => state.token.token);
    const dispatch = useAppDispatch();

    // Get the user profile and its id
    const getUserData = async() => {
        console.log('Getting the verified user data with token: ', accessToken);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/profile`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                }
            }
        );
        console.log('The User Data Is: ', response.data.data);
        dispatch(provideId(response.data.data.id));
    }

    const handleNameChange = () => {
        setIsEditingName(false);
        // Call API to update name and surname
        console.log('Updated Name:', name, surname);
    };

    const handleEmailChange = () => {
        setIsEditingEmail(false);
        setShowOTPModal(true); // Show OTP modal for email change
    };

    const handlePasswordChange = () => {
        setIsEditingPassword(false);
        updateMainCredentials();
        setShowOTPModal(true); // Show OTP modal for password change
    };

    const handlePasswordConfirmation = () => {
        // Simulate password confirmation
        if (currentPassword === 'password123') {
            setIsPasswordConfirmed(true);
        } else {
            alert('Incorrect password');
        }
    };

    // Update email & pwd funtion
    const updateMainCredentials = async() => {

        if (!userData.id || userData.id === '') {
            getUserData()
        }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/user/${userData.id}`,
          {
              "email": email,
              "pwd": password,
          },
          {
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
        console.log('The response is:', response.data);
      }


    return (
        <div className='w-full py-[12px] px-[18px] space-y-[16px] lg:space-y-[26px]'>
            <h4 className='text-[24px] hidden lg:block font-bold text-primary'>Profil</h4>

            {/* Name and Surname Section */}
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-bold text-[18px]'>Informations personnelles</h5>
                    {isEditingName ? (
                        <div className='flex gap-[8px]'>
                            <button
                                onClick={handleNameChange}
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
                            <h5 className='font-bold text-primary'>Edit</h5>
                            <PiPencilSimpleLineDuotone size={20} className='text-primary' />
                        </button>
                    )}
                </div>
                <div className='lg:grid grid-cols-2 lg:gap-[32px] gap-[16px] flex flex-col text-[14px] font-bold pr-[30%]'>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Nom</h5>
                        {isEditingName ? (
                            <input
                                type='text'
                                value={userData.name}
                                onChange={(e) => setName(e.target.value)}
                                className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                            />
                        ) : (
                            <h5>{userData.name}</h5>
                        )}
                    </div>
                    <div className='space-y-[8px]'>
                        <h5 className='text-gray_dark/50'>Prenom</h5>
                        {isEditingName ? (
                            <input
                                type='text'
                                value={userData.surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                            />
                        ) : (
                            <h5>{userData.surname}</h5>
                        )}
                    </div>
                </div>
                {isEditingName && (
                    <button
                        onClick={handleNameChange}
                        className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                    >
                        <h5 className='font-bold text-primary'>Save</h5>
                        <LiaCheckSolid size={20} className='text-primary' />
                    </button>
                )}
            </div>

            {/* Email Section */}
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-bold text-[18px]'>Email</h5>
                    {isEditingEmail ? (
                        <div className='flex gap-[8px]'>
                            <button
                                onClick={handleEmailChange}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                            >
                                <LiaCheckSolid size={20} className='text-primary' />
                            </button>
                            <button
                                onClick={() => setIsEditingEmail(false)}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-red'
                            >
                                <LiaTimesSolid size={20} className='text-red' />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingEmail(true)}
                            className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                        >
                            <h5 className='font-bold text-primary'>Edit</h5>
                            <PiPencilSimpleLineDuotone size={20} className='text-primary' />
                        </button>
                    )}
                </div>
                <div className='space-y-[8px] text-[14px] font-bold'>
                    <h5 className='text-gray_dark/50'>Email</h5>
                    {isEditingEmail ? (
                        <input
                            type='email'
                            value={userData.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                        />
                    ) : (
                        <h5>{email}</h5>
                    )}
                </div>
                {isEditingEmail && (
                    <button
                        onClick={handleEmailChange}
                        className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                    >
                        <h5 className='font-bold text-primary'>Save</h5>
                        <LiaCheckSolid size={20} className='text-primary' />
                    </button>
                )}
            </div>

            {/* Password Section */}
            <div className='rounded-[12px] border-2 border-gray p-[32px] space-y-[16px]'>
                <div className='flex justify-between'>
                    <h5 className='font-bold text-[18px]'>Mot de passe</h5>
                    {isEditingPassword ? (
                        <div className='flex gap-[8px]'>
                            <button
                                onClick={handlePasswordChange}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                            >
                                <LiaCheckSolid size={20} className='text-primary' />
                            </button>
                            <button
                                onClick={() => setIsEditingPassword(false)}
                                className='flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-red'
                            >
                                <LiaTimesSolid size={20} className='text-red' />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className='hidden lg:flex items-center gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                        >
                            <h5 className='font-bold text-primary'>Edit</h5>
                            <PiPencilSimpleLineDuotone size={20} className='text-primary' />
                        </button>
                    )}
                </div>
                <div className='space-y-[8px] text-[14px] font-bold'>
                    <h5 className='text-gray_dark/50'>Mot de passe</h5>
                    {isEditingPassword ? (
                        <>
                            <input
                                // type='password'
                                placeholder='Current Password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                            />
                            <button
                                onClick={handlePasswordConfirmation}
                                className='w-full bg-primary text-white px-[16px] py-[8px] rounded-[8px]'
                            >
                                Confirm Password
                            </button>
                            {isPasswordConfirmed && (
                                <input
                                    // type='password'
                                    placeholder='New Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full p-[8px] border-2 border-gray rounded-[8px]'
                                />
                            )}
                        </>
                    ) : (
                        <h5>********</h5>
                    )}
                </div>
                {isEditingPassword && (
                    <button
                        onClick={handlePasswordChange}
                        className='lg:hidden flex items-center justify-between w-full gap-[8px] p-[8px] rounded-[8px] border-2 border-primary'
                    >
                        <h5 className='font-bold text-primary'>Save</h5>
                        <LiaCheckSolid size={20} className='text-primary' />
                    </button>
                )}
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <OTPModal
                    onClose={() => setShowOTPModal(false)}
                    onVerify={(otp) => {
                        console.log('OTP Verified:', otp);
                        setShowOTPModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default ProfileSettings;