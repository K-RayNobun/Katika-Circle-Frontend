'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface OTPModalProps {
    onClose: () => void;
    onVerify: (otp: string) => void;
}

const OTPModal = ({ onClose, onVerify }: OTPModalProps) => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState<string[]>(Array(5).fill(''));

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
            onVerify(updatedOtp.join(''));
            console.log('VERIFYING THE OTP:', updatedOtp.join(''))
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-xl font-bold mb-4 text-center">{t('otpModal.title')}</h3>
                <p className="text-gray-600 mb-6 text-center">{t('otpModal.subtitle')}</p>
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
                <button
                    onClick={onClose}
                    className="w-full bg-primary text-white py-2 rounded-md font-semibold"
                >
                    {t('otpModal.close')}
                </button>
            </div>
        </div>
    );
};

export default OTPModal;