'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { CgTimer } from "react-icons/cg";
import AsyncSpinner from '@/components/AsyncSpinner';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasSubmittedOnceRef = useRef(false);
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        if(!hasSubmittedOnceRef.current) {
            console.log('Has never submitted.');
            return true;
        } else {
            console.log('Validation is ongoing');
        }
        const emailRegex = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
        console.log('Is Email Valid ', emailRegex.test(email));
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value.toLowerCase().trim());

        if (!validateEmail(value)) {
            setErrorMessage('Please enter a valid email address.');
        } else {
            setErrorMessage(null);
        }
    };

    // Get the pathNAme value after /password_reset
    

    const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        hasSubmittedOnceRef.current = true;
        if(!validateEmail(email)) {
            console.log('Email submitted is not valid');
            setErrorMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        } else {
            console.log('The email is valid: ', validateEmail(email));
        }
        
        // console.log('Submitted email:', email);

        // Add a 2 seconds timeout to simulate an API call
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
        
        setIsSubmitting(false);
        setErrorMessage(null);
        // Push to the mail_check page with URL parameters
        console.log('Router Push')
        router.push(`/auth/mail_check?email=${encodeURIComponent(email)}`);
        
    };

    return (
            <div className="flex flex-col items-center justify-start grow h-full bg-white rounded-lg lg:rounded-r-lg py-[10%]">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary/20 p-1 rounded-full">
                        <CgTimer size={30} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary_dark mt-4">
                        {t('resetPassword.title')}
                    </h1>
                    <p className="text-gray-600 text-center mt-2">
                        {t('resetPassword.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-10/12 space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            {t('resetPassword.emailLabel')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder={t('resetPassword.emailPlaceholder')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    {/* Error message displays here */}
                    {errorMessage && (
                        <div className="text-red text-center font-semibold text-sm mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary_dark transition ${
                            !validateEmail(email) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!validateEmail(email)}
                    >
                        {isSubmitting
                            ? <AsyncSpinner />
                            : t('resetPassword.send')}
                    </button>
                </form>
            </div>
    );
};

export default ResetPassword;