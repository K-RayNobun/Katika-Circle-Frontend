'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useApiGet } from '@/lib/hooks/useApiRequest';

import axios from 'axios';
import { useAppSelector } from '@/lib/redux/hooks';

interface OTPModalProps {
    onClose: () => void;
}

const OTPModal = ({ onClose }: OTPModalProps) => {
    const { t } = useTranslation();
    const {fetchData: fetchOtpData} = useApiGet<string>();
    const accessToken = useAppSelector((state) => state.token.token);

    const [otp, setOtp] = useState<string[]>(Array(5).fill(''));
    const [isPinCorrect, setIsPinCorrect] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isPinCorrect) {
            // Wait for 2 seconds before closing the modal
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isPinCorrect]);

    useEffect(() => {
         const sendOTP = async () => {
            // console.log('Sending OTP');
            // console.log('Access Token is: ', accessToken)
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp`,
                {},
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            // console.log('Finished sending OTP with the token', accessToken);
            // console.log('Just sent the token successfully as ', response.data);
        };
        sendOTP();
    }, []);

    const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedOtp = [...otp];
        const inputValue = e.target.value.slice(0, 1); // Ensure only one character
        updatedOtp[index] = inputValue;
        setOtp(updatedOtp);

        // Automatically move to the next input
        if (inputValue && index + 1 < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }

        // If all inputs are filled, verify the OTP
        if (updatedOtp.join('').length === 5) {
            verifyOTP(updatedOtp.join(''));
            console.log('VERIFYING THE OTP:', updatedOtp.join(''))
        }
    };

    const verifyOTP = async (pinCode:string) => {
        // console.log('Access Token is:', accessToken);
        // console.log('The PIN Code is: ', pinCode);
        const message = await fetchOtpData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp?code=${pinCode}`);
        // console.log('Verification Result: ', response.data)
        if (message) {
            if (message.toLowerCase() === 'otp valid with success') {
                console.log('\t #### PIN Code is Right !');
                setIsPinCorrect(true);
                setError(null);
            } else if (message.toLowerCase() === 'invalid otp code provided') {
                console.log('PIN Code is Incorrect');
                setError(t('otpModal.incorrectPin'));
                setIsPinCorrect(false);
            } else {
                console.log('The PIN cannot be decided as neither right or wrong. Check your code');
            }
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-xl font-bold mb-4 text-center">{t('settingsProfile.otpModal.title')}</h3>
                <p className="text-gray-600 mb-6 text-center">{t('settingsProfile.otpModal.subtitle')}</p>
                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpInput(e, index)}
                            maxLength={1}
                            className={`w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                    ))}
                </div>
                {error && <p className="text-red text-center text-sm font-semibold mb-4">{error}</p>}
                <button
                    onClick={onClose}
                    className="w-full bg-primary text-white py-2 rounded-md font-semibold"
                >
                    {t('settingsProfile.otpModal.close')}
                </button>
            </div>
        </div>
    );
};

export default OTPModal;