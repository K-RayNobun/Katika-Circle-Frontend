'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface OTPModalProps {
    onClose: () => void;
    onVerify: (otp: string) => void;
}

const OTPModal = ({ onClose, onVerify }: OTPModalProps) => {
    const [otp, setOtp] = useState<string[]>(Array(5).fill(''));
    const [isOtpCorrect, setIsOtpCorrect] = useState<boolean | null>(null);

    const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedOtp = [...otp];
        const inputValue = e.target.value;

        if (inputValue.length === 1) {
            updatedOtp[index] = inputValue;
            if (index + 1 < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        } else if (inputValue.length === 0 && index >= 0) {
            updatedOtp[index] = inputValue;
            if (index - 1 >= 0) {
                document.getElementById(`otp-${index - 1}`)?.focus();
            }
        }

        setOtp(updatedOtp);

        if (updatedOtp.join('').length === 5) {
            verifyOtp(updatedOtp.join(''));
        }
    };

    const verifyOtp = (otpCode: string) => {
        // Simulate OTP verification
        if (otpCode === '12345') {
            setIsOtpCorrect(true);
            onVerify(otpCode);
        } else {
            setIsOtpCorrect(false);
        }
    };

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-50'>
            <div className='bg-white rounded-[12px] p-[24px] w-[90%] lg:w-[50%] max-h-[80vh] overflow-auto'>
                <h3 className='text-[24px] font-bold mb-[16px]'>OTP Verification</h3>
                <div className='flex justify-evenly'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <input
                            key={i}
                            id={`otp-${i}`}
                            type='text'
                            value={otp[i]}
                            onChange={(e) => handleOtpInput(e, i)}
                            maxLength={1}
                            className={`appearance-none size-[56px] text-center text-[28px] font-[400] text-primary_text rounded-[12px] border-2 focus:border-2 ${
                                isOtpCorrect === true
                                    ? 'border-green focus:border-green'
                                    : isOtpCorrect === false
                                    ? 'border-red focus:border-red'
                                    : 'border-gray_dark/60 focus:border-primary'
                            }`}
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className='mt-[16px] bg-primary text-white px-[16px] py-[8px] rounded-[8px]'
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default OTPModal;