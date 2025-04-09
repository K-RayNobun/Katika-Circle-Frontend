'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { RiKeyFill } from "react-icons/ri";
import AsyncSpinner from '@/components/AsyncSpinner';
import { LuEyeClosed, LuEye } from "react-icons/lu";

const PasswordRenew = () => {
    const { t } = useTranslation();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Use refs with a non-null innitial value instead of state for better performance
    const newPasswordRef = useRef<string>('');
    const confirmPasswordRef = useRef<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validatePasswords = () => {
        if (newPasswordRef.current.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return false;
        }
        if (newPasswordRef.current !== confirmPasswordRef.current) {
            setErrorMessage('Passwords do not match.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    // A function that is passes event, verify using validatePasswords the field value and set the state
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        if (id === 'new-password') {
            newPasswordRef.current = value; // Update ref value
        } else if (id === 'confirm-password') {
            confirmPasswordRef.current = value; // Update ref value
        }

        validatePasswords();
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePasswords()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Password successfully reset!');
        }, 2000);
    };

    return (
        <div className="grow flex flex-col items-center justify-start h-full bg-white rounded-lg px-12 py-[10%]">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-primary/20 p-2 rounded-full">
                    <RiKeyFill size={24} className="text-primary" />
                </div>
                <h1 className="text-2xl font-semibold text-primary_dark mt-4">
                    {t('passwordRenew.title')}
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    {t('passwordRenew.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        defaultValue={newPasswordRef.current}
                        onChange={handlePasswordChange}
                        placeholder={t('passwordRenew.newPasswordPlaceholder')}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-3 font-semibold flex items-center text-gray_dark/60"
                    >
                        {showNewPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        defaultValue={confirmPasswordRef.current}
                        onChange={handlePasswordChange}
                        placeholder={t('passwordRenew.confirmPasswordPlaceholder')}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 font-semibold flex items-center text-gray_dark/60"
                    >
                        {showConfirmPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                    </button>
                </div>
                {errorMessage && (
                    <div className="text-red text-center font-semibold text-sm mb-2">
                        {errorMessage}
                    </div>
                )}
                <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary_dark transition ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? <AsyncSpinner />
                        : t('passwordRenew.resetButton')}
                </button>
            </form>
        </div>
    );
};

export default PasswordRenew;